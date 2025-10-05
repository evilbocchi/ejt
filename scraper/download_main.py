import requests
import os

def download_wikitext(url, filename):
    if not os.path.exists(filename):
        print(f"Downloading {filename}...")
        webpage = requests.get(url)
        wikitext = webpage.json()['query']['pages'][0]['revisions'][0]['slots']['main']['content']
        with open(filename, 'w', encoding='utf-8') as file:
            file.write(wikitext)
    else:
        print(f"Using existing {filename}...")
        with open(filename, 'r', encoding='utf-8') as file:
            wikitext = file.read()
    return wikitext

download_wikitext('https://jtohs-joke-towers.fandom.com/api.php?action=query&prop=revisions&titles=Main_Difficulty_Chart&rvslots=main&rvprop=content&formatversion=2&format=json', 'difficulties/source.wikitext')