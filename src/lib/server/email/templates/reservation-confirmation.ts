export const txtTemplate = `DriveXperience
==============

Hi %name%,

Thank you for choosing DriveXperience. Your reservation has been confirmed with the following details:

Planned Departure: %plannedDeparture%
Planned Return: %plannedReturn%
Number of Days Rented: %daysRented%
Quoted Price: %quotedPrice%
Car Name: %carName%
Branch Name: %branchName%
Branch Address: %branchAddress%
Branch City: %branchCity%
Branch Region: %branchRegion%
Branch Postal Code: %branchPostalCode%

If you have any questions or need further assistance, feel free to contact us.

Sincerely,
DriveXperience`;

export const htmlTemplate = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DriveXperience Reservation Confirmation</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f7f8f9;
            color: #000;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        h1 {
            text-align: center;
            margin-top: 0;
        }

        p {
            margin: 0 0 10px;
        }

        .details {
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .details p {
            margin-bottom: 10px;
        }

        .footer {
            text-align: center;
            margin-top: 20px;
        }

        .branch-info {
            padding-left: 20px;
            border-left: 2px solid #ccc;
            margin-top: 10px;
        }

        .branch-info p {
            margin: 5px 0;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>DriveXperience</h1>
        <div class="details">
            <p>Hi %name%,</p>
            <p>Thank you for choosing DriveXperience. Your reservation has been confirmed with the following details:</p>
            <ul>
                <li>Planned Departure: %plannedDeparture%</li>
                <li>Planned Return: %plannedReturn%</li>
                <li>Number of Days Rented: %daysRented%</li>
                <li>Quoted Price: %quotedPrice% $</li>
                <li>Car Name: %carName%</li>
                <img src="%carImageURL%" style="width: 200px; height: auto;" />
            </ul>
            <div class="branch-info">
                <p>Branch Information:</p>
                <p>Name: %branchName%</p>
                <p>Address: %branchAddress%, %branchCity%, %branchRegion%, %branchPostalCode%</p>
            </div><br>
            <p>If you have any questions or need further assistance, feel free to contact us.</p>
        </div>
        <div class="footer">
            <p>Sincerely,</p>
            <p>DriveXperience</p>
        </div>
    </div>
</body>

</html>

`;
