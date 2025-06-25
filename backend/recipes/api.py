import requests
from django.http import Http404
from rest_framework.exceptions import ValidationError


class OpenFoodFactsApi:
    base_url = "https://world.openfoodfacts.org/"
    base_api_url = base_url + "api/v2/"

    def make_request(self, method, path: str = "", **kwargs):
        return requests.request(method, f"{self.base_url}{path}", **kwargs)

    def make_api_request(self, method, path: str = "", **kwargs):
        return requests.request(method, f"{self.base_api_url}{path}", **kwargs)

    def get_product_by_barcode(self, barcode: str):
        response = self.make_api_request("GET", path=f"product/{barcode}.json")
        if response.status_code == 200:
            data = response.json()
            if not data.get('code'):
                raise ValidationError(f"Введён некорректный штрих-код {barcode}")
            return data
        raise Http404(f"Не найден продукт со штрих-кодом {barcode}")
    
    def search_products(self, search_terms: str, page = 1, page_size: int = 25):

        response = self.make_request("GET", path="cgi/search.pl", params={
            "search_terms": search_terms,
            "page": page,
            "page_size": page_size,
            "json": True
        })

        if response.status_code == 200:
            return response.json()
        # TODO: исправить на адекватную ошибку
        raise response
        
