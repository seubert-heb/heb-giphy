import requests


class GiphyClient:
    def __init__(self, api_key=None):
        self.api_key = api_key

    def search_gifs(self, search_term):
        search_resp = requests.get("http://api.giphy.com/v1/gifs/search",
                                   params={'q': search_term,
                                           'api_key': self.api_key,
                                           'rating': 'g',
                                           'limit': 5})
        search_json = search_resp.json()['data']
        img_urls = [gif['images']['original']['webp'] for gif in search_json]
        return img_urls
