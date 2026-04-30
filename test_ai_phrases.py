#!/usr/bin/env python3
"""
Script de test pour l'endpoint de génération de phrases IA
Utilisation: python test_ai_phrases.py <theme_slug>
"""

import sys
import requests
import json

def test_ai_phrases(theme_slug, api_base_url='http://127.0.0.1:8000'):
    """Test l'endpoint de génération de phrases IA"""

    url = f"{api_base_url}/api/ai/phrases/"
    params = {
        'theme': theme_slug,
        'lang': 'ar'
    }

    try:
        print(f"Testing AI phrases generation for theme: {theme_slug}")
        print(f"URL: {url}")
        print(f"Params: {params}")
        print("-" * 50)

        response = requests.get(url, params=params)

        print(f"Status Code: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            print("✅ Success!")
            print(f"Theme: {data.get('theme')}")
            print(f"Language: {data.get('language')}")
            print("Generated phrases:")
            for i, phrase in enumerate(data.get('phrases', []), 1):
                print(f"  {i}. {phrase}")
        else:
            print("❌ Error!")
            try:
                error_data = response.json()
                print(f"Error: {error_data.get('error')}")
            except:
                print(f"Response: {response.text}")

    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python test_ai_phrases.py <theme_slug>")
        print("Example: python test_ai_phrases.py colors")
        sys.exit(1)

    theme_slug = sys.argv[1]
    test_ai_phrases(theme_slug)