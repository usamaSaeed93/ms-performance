from crud.schemas import TaxRate, TaxRateUpdate


class UpdateTaxRateRequest(TaxRateUpdate):
    id: int


class UpdateTaxRateResponse(TaxRate):
    ...

