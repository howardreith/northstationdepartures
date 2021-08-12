# MBTA North Station Commuter Rail Real-Time Departures Board

This application displays real-time departure data for the MBTA Commuter Rail at the Boston North Station stop.
Live production deployment available here: https://howardreith.github.io/northstationdepartures/

## Deploying Repo Locally
1. Clone the repo.
1. Install dependencies with `yarn`.
1. Register for an API key at https://api-v3.mbta.com/register
1. Create a .env.local file at the root of your local clone. Add `REACT_APP_API_KEY=[your-api-key]`.
1. Run the application with `yarn start`.

## Technical Details

- Built with Create React App
- Adheres to AirBNB linter rules
- Updates board via 10-second polling to the MBTA API. Documentation available [here](https://www.mbta.com/developers/v3-api).
- Tested with Jest and Enzyme
- Styled using Material-UI