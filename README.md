<p align="center">Bulk tool for scraping trading card prices. Allows for csv import/export and has ML image recognition for card name and card id.<br/>
Currently hosted with aws at https://www.synderispricechecker.com/.<br/>
Built with FastAPI and React<br/>
Currently supports Pokemon, Magic and Yugioh cards and most of the types of cards from each brand/format.</p>
<img src="https://i.imgur.com/BTSswG8.png">
The CSV import tool will attempt to fix data when it is empty such as changing null values in Card Count to 1 by default. Otherwise errors will be marked in red.
<img src="https://i.imgur.com/weWXvat.png">
If the error is in Card Count the red marking will be removed when fixed otherwise it will remain since the other fields have other error handling that should prevent most bad data.
<img src="https://i.imgur.com/oWBs57j.png">
It will still let you submit with errors but depending on the error the data you get may be for a different card or the total price calculation will be incorrect.
The view that you see is what will be submitted.
<img src="https://i.imgur.com/k888Atx.png">
Images can be uploaded and ran through a ML OCR image recognition to automatically pull the card name and card id into the form.
<img src="https://i.imgur.com/wfFfWIT.png">
The table will provide price data and totals adjusted for card count along with its page link. The card image can also be seen by hovering over the card name. This data can be exported to CSV in the same format as the table.
<img src="https://i.imgur.com/gHtKHzC.png">
After getting price data specific rows can be filtered out of the total pricing calculations.

## Developing

### Upgrading python dependencies

```sh
$ pip install uv
$ uv pip compile requirements.in --output-file requirements.txt --upgrade-package name_of_package
```
