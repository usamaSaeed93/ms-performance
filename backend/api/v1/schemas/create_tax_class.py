from crud.schemas import TaxClass, TaxClassCreate


class CreateTaxClassRequest(TaxClassCreate):
    ...


class CreateTaxClassResponse(TaxClass):
    ...

