# icdph-iban

Konverzia IČ DPH na IBAN. Používa opendata.financnasprava.sk API.
Používa prostredie `node.js`

## Predpoklady

* nainštalované `node.js` prostredie, viac na https://nodejs.org/en/download/

## Stiahnutie a inštalácia 

```bash
git clone https://github.com/mirobartanus/icdph-iban.git
cd icdph-iban
npm install
npm link
```

## Získanie API_KEY

* Vygenerujte a aktivujte API kľúč na https://opendata.financnasprava.sk/page/openapi
* Skopírujte prázdny `.env.example` do `.env`
* Prepíšte `API_KEY` v `.env` aktivovaným kľúčom

Príklad `.env`
```
API_KEY=ZyAGg99lbSB1ikVsfhlYHQx1nddoFC93Dq0qPn...
```

## Použitie

### Zisti IBAN pre jedno IČ DPH. Výstup na terminál:
```bash
icdph-iban SK2020269922
```

Výstup:
```
[
  {
    nazov_subjektu: 'Dynatech s.r.o.',
    ic_dph: 'SK2020269922',
    iban: 'SK2211000000002928849342',
    ico: '35737581',
    obec: 'Bratislava - mestská časť Rača',
    ulica_cislo: 'Hečkova 7461/10',
    psc: '83105',
    stat: 'SK'
  }
]
```

### Zisti IBAN pre viac IČ DPH. Výstup na terminál:
```bash
icdph-iban SK2020269922 SK2020220862 SK2021787801
```

### Zisti IBAN pre viac IČ DPH uložených v Exceli. Výstup na terminál:
```bash
icdph-iban icdph.xlsx
```

Formát vstupného XLSX súboru [icdph.xlsx](icdph.xlsx) :

| interny_nazov          | ic_dph       |
| ---------------------- | ------------ |
| Dynatech               | SK2020269922 |
| VOLKSWAGEN             | SK2021787801 |
| CHYBNÁ POLOŽKA, s.r.o. | SK2820569154 |
| Kia                    | SK2021787801 |


### Zisti IBAN pre viac IČ DPH uložených v Exceli. Výstup do Excelu:
```bash
icdph-iban -v icdph.xlsx iban.xlsx
```

Formát výstupného XLSX súboru [iban.xlsx](iban.xlsx) :

| nazov_subjektu            | ic_dph       | iban                     | ico      | obec                                | ulica_cislo                 | psc   | stat | interny_nazov          | error                 |
| ------------------------- | ------------ | ------------------------ | -------- | ----------------------------------- | --------------------------- | ----- | ---- | ---------------------- | --------------------- |
| Dynatech s.r.o.           | SK2020269922 | SK2211000000002928849342 | 35737581 | Bratislava - mestská časť Rača      | Hečkova 7461/10             | 83105 | SK   |                        |                       |
| VOLKSWAGEN SLOVAKIA, a.s. | SK2020220862 | SK7280500000000070008059 | 35757442 | Bratislava - m.č. Devínska Nová Ves | J. Jonáša 1                 | 84302 | SK   |                        |                       |
|                           |              | SK9011000000002623007312 |          |                                     |                             |       |      |                        |                       |
|                           | SK2820569154 |                          |          |                                     |                             |       |      | CHYBNÁ POLOŽKA, s.r.o. | IČ DPH nebolo nájdené |
| Kia Slovakia s. r. o.     | SK2021787801 | SK0681300000002006760704 | 35876832 | Teplička nad Váhom                  | Sv. Jána Nepomuckého 1282/1 | 84302 | SK   |                        |                       |
|                           |              | SK1902000000001809203253 |          |                                     |                             |       |      |                        |                       |
|                           |              | SK2881300000002006760405 |          |                                     |                             |       |      |                        |                       |
|                           |              | SK3381300000002006760800 |          |                                     |                             |       |      |                        |                       |

## Poznámky a obmedzenia

* V prípade, že dané IČ DPH má zaregistrovaných viacero účtov, tieto sú uvedené v samostatných riadkoch pod ním a je vyplnené len pole `IBAN`
* V prípade, že nie je možné dané IČ DPH vyhľadať, tak sú vyplnené len polia `ic_dph`, `interny_nazov` a `error`
* `API_KEY` je limitovaný na 1000 požiadaviek za 1 hodinu
* Príklaz `icdph-iban` funguje z ľubovoľného adresára
* Vyvinuté a otestované na prostredí Windows 10:

```
node -v
v14.18.1
```

```
npm -v
6.14.15
```

```
systeminfo
...
OS Name:    Microsoft Windows 10 Pro
OS Version: 10.0.19042 N/A Build 19042
...
```
