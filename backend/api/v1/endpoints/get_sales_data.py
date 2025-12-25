import pandas as pd
from fastapi import status
from collections import defaultdict

import crud
from api.base_resource import GetResource
from ..schemas.get_sales_data import GetSalesDataRequest, GetSalesDataResponse


class GetSalesData(GetResource):
    request_schema = GetSalesDataRequest
    authentication_required = True

    # Endpoint details
    api_name = "get_sales_data"
    api_url = "get_sales_data"

    async def get_sales_data(self):
        self.sales = await crud.sale.get_sales_data(
            self.db,
            start_date=self.request_data.start_date,
            end_date=self.request_data.end_date,
            product_ids=self.request_data.product_ids,
            category_ids=self.request_data.category_ids,
        )
        self.sales = [s._asdict() for s in self.sales]
        for sale in self.sales:
            sale["revenue"] = sale["quantity"] * sale["price_per_unit"]

    async def create_buckets(self):
        # Buckets can be daily, weekly, monthly and yearly
        # Given start and end date construct possible buckets
        self.buckets = {}

        match (self.request_data.buckets):
            case "weekly":
                buckets = pd.DataFrame(
                    pd.period_range(
                        start=self.request_data.start_date,
                        end=self.request_data.end_date,
                        freq="W",
                    )
                )
            case "monthly":
                buckets = pd.DataFrame(
                    pd.period_range(
                        start=self.request_data.start_date,
                        end=self.request_data.end_date,
                        freq="M",
                    )
                )
            case "yearly":
                buckets = pd.DataFrame(
                    pd.period_range(
                        start=self.request_data.start_date,
                        end=self.request_data.end_date,
                        freq="Y",
                    )
                )
            case _:
                buckets = pd.DataFrame(
                    pd.period_range(
                        start=self.request_data.start_date,
                        end=self.request_data.end_date,
                        freq="D",
                    )
                )

        for bucket in buckets[0]:
            self.buckets[
                (
                    bucket.start_time,
                    bucket.end_time,
                )
            ] = {
                "sales": list(),
                "total_revenue": 0,
                "revenue_by_categories": defaultdict(lambda: 0),
                "revenue_by_products": defaultdict(lambda: 0),
                "quantity_by_categories": defaultdict(lambda: 0),
                "quantity_by_products": defaultdict(lambda: 0),
            }

    async def populate_buckets(self):
        for sale in self.sales:
            for bucket in self.buckets:
                if sale["created_at"] >= bucket[0] and sale["created_at"] <= bucket[1]:
                    if self.request_data.include_sales_items:
                        self.buckets[bucket]["sales"].append(sale)
                    self.buckets[bucket]["total_revenue"] += sale["revenue"]
                    self.buckets[bucket]["revenue_by_categories"][
                        (sale["category_id"], sale["category_name"])
                    ] += sale["revenue"]
                    self.buckets[bucket]["revenue_by_products"][
                        (sale["product_id"], sale["product_name"])
                    ] += sale["revenue"]
                    self.buckets[bucket]["quantity_by_categories"][
                        (sale["category_id"], sale["category_name"])
                    ] += sale["quantity"]
                    self.buckets[bucket]["quantity_by_products"][
                        (sale["product_id"], sale["product_name"])
                    ] += sale["quantity"]
                    break

    async def populate_metrics(self):
        # Metrics without the buckets headache
        self.buckets = {
            "sales": list(),
            "total_revenue": 0,
            "revenue_by_categories": defaultdict(lambda: 0),
            "revenue_by_products": defaultdict(lambda: 0),
            "quantity_by_categories": defaultdict(lambda: 0),
            "quantity_by_products": defaultdict(lambda: 0),
        }
        if self.request_data.include_sales_items:
            self.buckets["sales"] = self.sales
        for sale in self.sales:
            self.buckets["total_revenue"] += sale["revenue"]
            self.buckets["revenue_by_categories"][
                (sale["category_id"], sale["category_name"])
            ] += sale["revenue"]
            self.buckets["revenue_by_products"][
                (sale["product_id"], sale["product_name"])
            ] += sale["revenue"]
            self.buckets["quantity_by_categories"][
                (sale["category_id"], sale["category_name"])
            ] += sale["quantity"]
            self.buckets["quantity_by_products"][
                (sale["product_id"], sale["product_name"])
            ] += sale["quantity"]

    async def generate_response(self):
        self.status_code = status.HTTP_200_OK
        self.response_message = "Sales and Revenue data retrieved successfully"
        
        # Transform buckets to frontend-friendly format
        if self.request_data.buckets:
            bucketed_sales = []
            for (start_time, end_time), bucket_data in self.buckets.items():
                # Format period based on bucket type
                if self.request_data.buckets == "daily":
                    period = start_time.strftime("%Y-%m-%d")
                elif self.request_data.buckets == "weekly":
                    period = f"{start_time.strftime('%Y-%m-%d')} to {end_time.strftime('%Y-%m-%d')}"
                elif self.request_data.buckets == "monthly":
                    period = start_time.strftime("%Y-%m")
                elif self.request_data.buckets == "yearly":
                    period = start_time.strftime("%Y")
                else:
                    period = start_time.strftime("%Y-%m-%d")
                
                bucketed_sales.append({
                    "period": period,
                    "revenue": float(bucket_data["total_revenue"]),
                    "count": len(bucket_data["sales"]) if self.request_data.include_sales_items else 0,
                    "start_time": start_time.isoformat(),
                    "end_time": end_time.isoformat(),
                })
            
            # Sort by start_time
            bucketed_sales.sort(key=lambda x: x["start_time"])
            
            # Calculate total revenue
            total_revenue = sum(b["revenue"] for b in bucketed_sales)
            
            self.response_data = {
                "bucketed_sales": bucketed_sales,
                "total_revenue": float(total_revenue),
                "sales": [sale for bucket_data in self.buckets.values() for sale in bucket_data.get("sales", [])] if self.request_data.include_sales_items else [],
            }
        else:
            # No buckets - return metrics format
            self.response_data = {
                "total_revenue": float(self.buckets["total_revenue"]),
                "sales": self.buckets["sales"] if self.request_data.include_sales_items else [],
                "revenue_by_categories": {f"{k[1]} (ID: {k[0]})": float(v) for k, v in self.buckets["revenue_by_categories"].items()},
                "revenue_by_products": {f"{k[1]} (ID: {k[0]})": float(v) for k, v in self.buckets["revenue_by_products"].items()},
                "quantity_by_categories": {f"{k[1]} (ID: {k[0]})": int(v) for k, v in self.buckets["quantity_by_categories"].items()},
                "quantity_by_products": {f"{k[1]} (ID: {k[0]})": int(v) for k, v in self.buckets["quantity_by_products"].items()},
            }

    async def process_flow(self):
        await self.get_sales_data()

        if self.request_data.buckets:
            await self.create_buckets()
            await self.populate_buckets()
        else:
            await self.populate_metrics()

        await self.generate_response()
