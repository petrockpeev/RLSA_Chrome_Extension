<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<br />
<div align="center">
  <a href="https://github.com/petrockpeev/RLSA_Chrome_Extension">
  </a>

<h3 align="center">RLSA (Google Chrome Extension)</h3>

  <p align="center">
    Rinconada Language Sentiment Analyzer
    A simple sentiment analyzer for the Philippine dialect "Bicol Rindonada" 
    <br />
    <a href="https://github.com/petrockpeev/RLSA_Chrome_Extension"><strong>Explore the docs »</strong></a>
    <br />
  </p>
</div>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

This project is a Google Chrome extension that performs sentiment analysis on Rinconada language texts. It uses a pre-trained Support Vector Machine (SVM) model with a TF-IDF vectorizer to classify input as positive, negative, or neutral. The extension communicates with a Flask-based backend server that handles the sentiment processing. Designed to support local language technology, the tool helps analyze the emotional tone of Rinconada texts directly from the browser.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![JavaScript][JavaScript.com]][JavaScript-url]
* [![Python][python.org]][python-url]
* [![Flask][Flask.com]][Flask-url]
* [![CSS][CSS.org]][CSS-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Get a free API Key at [https://example.com](https://example.com)
2. Clone the repo
   ```sh
   git clone https://github.com/github_username/repo_name.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API in `config.js`
   ```js
   const API_KEY = 'ENTER YOUR API';
   ```
5. Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin github_username/repo_name
   git remote -v # confirm the changes
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/petrockpeev/RLSA_Chrome_Extension.svg?style=for-the-badge
[contributors-url]: https://github.com/petrockpeev/RLSA_Chrome_Extension/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/petrockpeev/RLSA_Chrome_Extension.svg?style=for-the-badge
[forks-url]: https://github.com/petrockpeev/RLSA_Chrome_Extension/network/members
[stars-shield]: https://img.shields.io/github/stars/petrockpeev/RLSA_Chrome_Extension.svg?style=for-the-badge
[stars-url]: https://github.com/petrockpeev/RLSA_Chrome_Extension/stargazers
[issues-shield]: https://img.shields.io/github/issues/petrockpeev/RLSA_Chrome_Extension.svg?style=for-the-badge
[issues-url]: https://github.com/petrockpeev/RLSA_Chrome_Extension/issues
[JavaScript.com]: https://shields.io/badge/JavaScript-F7DF1E?logo=JavaScript&logoColor=000&style=flat-square
[JavaScript-url]: https://www.javascript.com
[python.org]: https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=
[python-url]: https://www.python.org
[Flask.com]: https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=Flask&logoColor=white
[Flask-url]: https://flask.palletsprojects.com/en/stable
[CSS.org]: https://img.shields.io/badge/Style-CSS3-blue?style=for-the-badge&logo=css3&logoColor=white
[CSS-url]: https://www.w3.org/Style/CSS/Overview.en.html