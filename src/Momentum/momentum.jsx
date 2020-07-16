import React, { Component } from "react";
import {
  Typography,
  Paper,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";
import "./styles.css";

export default class App extends Component {
  state = {
    morning: ["mrng1", "mrng2", "aft1", "evng3"],
    afternoon: ["aft1", "aft2", "aft3", "aft4"],
    evening: ["evng1", "evng2", "evng3", "evng4"],
    quote: "",
    wish: "",
    backgroundImage: "evng2",
    checked: false,
    time: "",
    work: "",
  };
  componentDidMount = () => {
    setInterval(this.updateTime, 1000);
    var time = new Date();
    var hours = time.getHours();
    var randImg = Math.floor(Math.random() * 4);
    if (hours > 18) {
      this.setState({
        wish: "good evening",
        backgroundImage: this.state.evening[randImg],
      });
    } else if (hours > 12) {
      this.setState({
        wish: "good evening",
        backgroundImage: this.state.afternoon[randImg],
      });
    } else {
      this.setState({
        wish: "good morning",
        backgroundImage: this.state.morning[randImg],
      });
    }

    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://quotesondesign.com/wp-json/wp/v2/posts/?orderby=rand",
      true
    );
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var res = JSON.parse(xhr.responseText);
        var rand = Math.floor(3 * Math.random());
        var quote = res[rand]["content"]["rendered"];
        this.setState({ quote });
      }
    };
    xhr.send();
  };
  handleTodo = (e) => {
    if (e.keyCode == 13) {
      this.setState({ work: e.target.value });
    }
  };
  updateTime = () => {
    var x = new Date();
    var hour = x.getHours();
    var min = x.getMinutes();
    if (min < 10) {
      min = "0" + min;
    }
    this.setState({ time: hour + ":" + min });
  };
  render() {
    return (
      <div>
        <img
          src={require(`./${this.state.backgroundImage}.jpg`)}
          width="100%"
          height="100%"
        />
        <div className="paper">
          <Typography variant="h3"> {this.state.time}</Typography>

          <Typography
            variant="h6"
            style={{ color: "white", textTransform: "capitalize" }}
          >
            {this.state.wish},Saiteja.
          </Typography>

          {this.state.work === "" && (
            <Typography
              variant="body1"
              className="focus"
              style={{ color: "white", textTransform: "capitalize" }}
            >
              What is your main focus for today?
            </Typography>
          )}
          {this.state.work === "" && (
            <input
              type="text"
              className="input"
              onKeyUp={(e) => this.handleTodo(e)}
            />
          )}
          {this.state.work !== "" && (
            <React.Fragment>
              <Typography variant="h6">Today </Typography>
              <Grid container spacing={0} justify="center">
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.checked}
                        style={{ color: "white" }}
                        onChange={() => {
                          this.setState({ checked: !this.state.checked });
                        }}
                      />
                    }
                    label={
                      <>
                        <Typography
                          variant="subtitle1"
                          style={
                            this.state.checked
                              ? {
                                  textDecoration: "line-through",
                                  color: "white",
                                }
                              : { color: "white" }
                          }
                        >
                          {this.state.work}
                        </Typography>
                      </>
                    }
                  />
                </Grid>
                <Grid item>
                  {!this.state.checked && (
                    <CloseIcon
                      style={{
                        color: "white",

                        marginTop: "10px",
                      }}
                      onClick={() => {
                        this.setState({ checked: true });
                      }}
                    />
                  )}
                  {this.state.checked && (
                    <AddIcon
                      style={{
                        color: "white",

                        marginTop: "10px",
                      }}
                      onClick={() => {
                        this.setState({ work: "", checked: false });
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </React.Fragment>
          )}
          <Typography
            varinat="body1"
            className="quote"
            dangerouslySetInnerHTML={{ __html: this.state.quote }}
            style={{ color: "white" }}
          />
        </div>
      </div>
    );
  }
}
