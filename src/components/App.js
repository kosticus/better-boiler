import React, { useEffect, useState } from "react";
import { Grid, Typography, RadioGroup, Radio, Divider, Box } from '@material-ui/core';
import RadioForm from './RadioForm.js';
import axios from 'axios';

const App = () => {
  const [applicationData, setApplicationData] = useState([]);
  const [appsSent, setAppsSent] = useState(0);
  const [phoneScreens, setPhoneScreens] = useState(0);
  const [interviews, setInterviews] = useState(0);
  const [offers, setOffers] = useState(0);
  const [phoneScreensRate, setPhoneScreensRate] = useState(0);
  const [interviewsRate, setInterviewsRate] = useState(0);
  const [offersRate, setOffersRate] = useState(0);
  const [updatedRates, setUpdatedRates] = useState(false);
  const [lastStepReached, setLastStepReached] = useState('');

  useEffect(() => {
    requestData();
  }, []);

  useEffect(() => {
    requestData();
  }, [updatedRates]);

  // axios request function
  const requestData = () => {
    axios.get('http://localhost:3000/applications')
      .then((applications) => {
        setApplicationData(applications.data);
        calculateRates(applications.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // calculates the user's conversion rates and sets the amounts
  const calculateRates = (data) => {
    let appsSentCount = 0;
    let phoneScreensCount = 0;
    let interviewsCount = 0;
    let offersCount = 0;

    for (let i = 0; i < data.length; i++) {
      if (data[i].application === true) {
        appsSentCount++;
      }
      if (data[i].phone_screen === true) {
        phoneScreensCount++;
      }
      if (data[i].interview === true) {
        interviewsCount++;
      }
      if (data[i].offer === true) {
        offersCount++;
      }
    }
    setAppsSent(appsSentCount);
    setPhoneScreens(phoneScreensCount);
    setInterviews(interviewsCount);
    setOffers(offersCount);

    setPhoneScreensRate(Math.round((phoneScreensCount / data.length) * 100));
    setInterviewsRate(Math.round((interviewsCount / data.length) * 100));
    setOffersRate(Math.round((offersCount / data.length) * 100));
  };

  // handle the form submit
  const handleRadioSubmit = (event) => {
    event.preventDefault();

    let newApplicationData = {
      application: true,
      phone_screen: false,
      interview: false,
      offer: false
    };

    if (lastStepReached === 'phone') {
      newApplicationData.phone_screen = true;
    } else if (lastStepReached === 'interview') {
      newApplicationData.phone_screen = true;
      newApplicationData.interview = true;
    } else if (lastStepReached === 'offer') {
      newApplicationData.phone_screen = true;
      newApplicationData.interview = true;
      newApplicationData.offer = true;
    }

    axios.post('/applications', newApplicationData)
      .then((res) => {
        setUpdatedRates(!updatedRates);
      })
      .catch((err) => {
        console.log(err);
      })
  };

  return (
    <Box pt={16}>
      <Grid container>
        <Grid item xs={1}></Grid>
        <Grid item xs={3}>
          <Typography style={{ fontSize: 30 }}>
            <b>How far did you make it through the interview process?</b>
          </Typography>
          <br />
          <RadioForm
            handleRadioSubmit={handleRadioSubmit}
            lastStepReached={lastStepReached}
            setLastStepReached={setLastStepReached}
          />
        </Grid>
        <Grid item xs={7}>
          <Box pl={6}>
            <Grid container direction="row">
              <Grid item xs={5}>
                <Box>
                  <Typography style={{ fontSize: 30 }}>
                    <b>Base Conversion Rates:</b>
                  </Typography>
                  <br />
                  <Typography style={{ fontSize: 22 }}>
                    100 Applications Sent
                  </Typography>
                  <Typography style={{ fontSize: 22 }}>
                    20 Phone Screens (20%)
                  </Typography>
                  <Typography style={{ fontSize: 22 }}>
                    10 In-Person Interviews (50%)
                  </Typography>
                  <Typography style={{ fontSize: 22 }}>
                    2 Offers (20%)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={2}></Grid>
              <Grid item xs={5}>
                <Box>
                  <Typography style={{ fontSize: 30 }}>
                    <b>Your Conversion Rates:</b>
                  </Typography>
                  <br />
                  <Typography style={{ fontSize: 22 }}>
                    {`${appsSent} Applications Sent`}
                  </Typography>
                  <Typography style={{ fontSize: 22 }}>
                    {`${phoneScreens} Phone Screens (${phoneScreensRate}%)`}
                  </Typography>
                  <Typography style={{ fontSize: 22 }}>
                    {`${interviews} In-Person Interviews (${interviewsRate}%)`}
                  </Typography>
                  <Typography style={{ fontSize: 22 }}>
                    {`${offers} Offers (${offersRate}%)`}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <br />
          <Divider />
          <br />
          <Grid item>
            <Box pl={6}>
              <Typography style={{ fontSize: 30 }}>
                <b>Evaluation:</b>
              </Typography>
              <br />
              { phoneScreensRate < 20
                ? <Typography style={{ fontSize: 22 }}>
                  You are having some difficulty receiving phone screens from the companies you applied to. You should look over your resume again and see what you could change to make it better.
                </Typography>
                : <Typography style={{ fontSize: 22 }}>
                  You're doing very well receiving interviews from the companies you applied to!
                </Typography>
              }
              <br />
              { interviewsRate < 50
                ? <Typography style={{ fontSize: 22 }}>
                  You are having some difficulty receiving interviews from the companies you applied to. You should practice and improve your personal narrative.
                </Typography>
                : <Typography style={{ fontSize: 22 }}>
                  You're doing very well receiving phone screens from the companies you applied to!
                </Typography>
              }
              <br />
              { offers < 1
                ? <Typography style={{ fontSize: 22 }}>
                You are having some difficulty receiving offers from the companies you applied to. You should practice toy problems and refresh your knowledge on common interview questions.
                </Typography>
                : <Typography style={{ fontSize: 22 }}>
                  Congratulations! Thank you for using TrackR, good luck on the next step of your journey as a Software Developer!
                </Typography>
              }
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </Box>
  );
};

export default App;