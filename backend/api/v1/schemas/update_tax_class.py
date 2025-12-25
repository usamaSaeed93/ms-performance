from crud.schemas import TaxClass, TaxClassUpdate


class UpdateTaxClassRequest(TaxClassUpdate):
    id: int


class UpdateTaxClassResponse(TaxClass):
    ...

