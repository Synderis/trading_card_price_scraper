<p align="center">Bulk tool for scraping trading card prices. Allows for csv import/export and has ML image recognition for card name and card id.<br/>
Currently hosted with aws at https://www.synderispricechecker.com/.<br/>
Built with FastAPI and React<br/>
Currently supports Pokemon, Magic and Yugioh cards and most of the types of cards from each brand/format.</p>
<img src="https://i.imgur.com/yYGiOMQ.png">
The CSV import tool will attempt to fix data when it is empty such as changing null values in Card Count to 1 by default. Otherwise errors will be marked in red.
<img src="https://i.imgur.com/lRHqCFO.png">
If the error is in Card Count the red marking will be removed when fixed otherwise it will remain since the other fields have other error handling that should prevent most bad data. These errors will need to be corrected before submission.
<img src="https://i.imgur.com/0kzLFQt.png">
The view that you see is what will be submitted.
<img src="https://i.imgur.com/qLS6VxB.png">
Images can be uploaded and ran through an OCR model for image text recognition to automatically pull the card name and card id and a CNN Classifier Model to determine the card type.
<img src="https://i.imgur.com/wfFfWIT.png">
The table will provide price data and totals adjusted for card count along with its page link. The card image can also be seen by hovering over the card name. This data can be exported to CSV in the same format as the table.
<img src="https://i.imgur.com/gHtKHzC.png">
After getting price data specific rows can be filtered out of the total pricing calculations the results are also ran through an orb similarity matching algorithm to further optimize the result pool.