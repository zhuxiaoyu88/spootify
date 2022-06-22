import React, { Component } from "react";
import DiscoverBlock from "./DiscoverBlock/components/DiscoverBlock";
import "../styles/_discover.scss";
import axios from "axios";

const MAIN_ENDPOINT = "https://api.spotify.com/v1/browse";

export default class Discover extends Component {
  constructor() {
    super();

    this.state = {
      newReleases: [],
      playlists: [],
      categories: [],
      token: ""
    };
  }

  async componentDidMount() {
    axios("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          new Buffer(
            REACT_APP_SPOTIFY_CLIENT_ID + ":" + REACT_APP_SPOTIFY_CLIENT_SECRET
          ).toString("base64")
      },
      data: "grant_type=client_credentials"
    })
      .then((tokenResponse) => {
        this.setState({ token: tokenResponse.data.access_token });

        const axiosInstanceSpotify = axios.create({
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + this.state.token
          }
        });

        axios
          .all([
            axiosInstanceSpotify
              .get(`${MAIN_ENDPOINT}/new-releases`)
              .catch((error) => console.log(error)),
            axiosInstanceSpotify
              .get(`${MAIN_ENDPOINT}/featured-playlists`)
              .catch((error) => console.log(error)),
            axiosInstanceSpotify
              .get(`${MAIN_ENDPOINT}/categories`)
              .catch((error) => console.log(error))
          ])
          .then(
            axios.spread((resReleases, resPlaylists, resCategories) => {
              this.setState({ newReleases: resReleases.data.albums.items });
              this.setState({ playlists: resPlaylists.data.playlists.items });
              this.setState({
                categories: resCategories.data.categories.items
              });
            })
          );
      })
      .catch((error) => console.log(error));
  }

  render() {
    const { newReleases, playlists, categories } = this.state;

    return (
      <div className="discover">
        <DiscoverBlock
          text="RELEASED THIS WEEK"
          id="released"
          data={newReleases}
        />
        <DiscoverBlock
          text="FEATURED PLAYLISTS"
          id="featured"
          data={playlists}
        />
        <DiscoverBlock
          text="BROWSE"
          id="browse"
          data={categories}
          imagesKey="icons"
        />
      </div>
    );
  }
}
