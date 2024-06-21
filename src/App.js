import React, { useEffect, useState } from "react";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import axios from "axios";
import moment from "moment";
import { useTranslation } from "react-i18next";
import "moment/min/locales";
moment.locale("en");

const theme = createTheme({
  typography: {
    fontFamily: ["IBM"]
  }
});

function App() {
  const { t, i18n } = useTranslation();

  const [dateAndTime, setDateAndTime] = useState("");
  const [temp, setTemp] = useState({
    number: null,
    description: "",
    min: null,
    max: null,
    icon: "" // إضافة حالة الأيقونة
  });

  const [local, setLocal] = useState("ar");

  // Event Handlers

  function handleLanguageClick() {
    if (local === "en") {
      setLocal("ar");
      i18n.changeLanguage("ar");
      moment.locale("ar");
    } else {
      setLocal("en");
      i18n.changeLanguage("en");
      moment.locale("en");
    }
    setDateAndTime(moment().format("llll"));
  }
  useEffect(() => {
    i18n.changeLanguage("ar");
  }, []);

  useEffect(() => {
    setDateAndTime(moment().format("llll"));

    const source = axios.CancelToken.source();

    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?lat=51.4416&lon=5.4697&appid=69d12097e5eb3ee7e7b6ae52751068c1",
        {
          cancelToken: source.token
        }
      )
      .then(function (response) {
        const responseTemp = Math.round(response.data.main.temp - 273.15); // تصحيح درجة الحرارة
        const description = response.data.weather[0].description;
        const minTemp = Math.round(response.data.main.temp_min - 273.15);
        const maxTemp = Math.round(response.data.main.temp_max - 273.15);
        const icon = response.data.weather[0].icon; // الحصول على أيقونة الطقس

        setTemp({
          number: responseTemp,
          description: description,
          min: minTemp,
          max: maxTemp,
          icon: icon
        });
      })
      .catch(function (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else {
          console.log(error);
        }
      });

    return () => {
      source.cancel("Component unmounted");
    };
  }, []);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
          <div
            style={{
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column"
            }}
          >
            <div
              dir={local === "ar" ? "rtl" : "ltr"}
              style={{
                background: "rgba(28, 52, 91, 0.36)",
                color: "white",
                padding: "10px",
                borderRadius: "15px",
                boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.75)"
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "end" }}>
                  <Typography variant="h2" style={{ marginLeft: "20px" }}>
                    {t("Eindhoven")}
                  </Typography>
                  <Typography
                    variant="h6"
                    style={{ marginLeft: "10px", marginRight: "10px" }}
                  >
                    {dateAndTime}
                  </Typography>
                </div>
                <hr />
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <div>
                    <Typography variant="h3" style={{ textAlign: "left" }}>
                      {temp.number}
                      <span style={{ fontSize: "26px" }}>°C</span>
                    </Typography>
                    <Typography variant="h6">
                      {" "}
                      {t(`${temp.description}`)}
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around"
                      }}
                    >
                      <h5>
                        {" "}
                        {t("Min")}: {temp.min}{" "}
                      </h5>
                      <h5>|</h5>
                      <h5>
                        {" "}
                        {t("Max")}: {temp.max}{" "}
                      </h5>
                    </div>
                  </div>
                  <div>
                    <img
                      src={`https://openweathermap.org/img/wn/${temp.icon}@2x.png`}
                      alt="weather Icon"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: local === "ar" ? "end" : "start"
              }}
            >
              <Button
                style={{ color: "white", margin: "20px" }}
                variant="text"
                onClick={handleLanguageClick}
              >
                {i18n.language === "en" ? "العربية" : "English"}
              </Button>
            </div>
          </div>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
