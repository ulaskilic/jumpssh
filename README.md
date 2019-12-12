# JumpSSH
[![NPM Version](http://img.shields.io/npm/v/jumpssh.svg?style=flat)](https://www.npmjs.org/package/commander)
[![NPM Downloads](https://img.shields.io/npm/dm/jumpssh.svg?style=flat)](https://npmcharts.com/compare/commander?minimal=true)

SSH Session storage manager for easy jumps.

![JumpSSH](https://github.com/ulaskilic/jumpssh/raw/master/.github/splash.png)
## Installation
```bash
npm i -g jumpssh
```
## Usage
```bash
jumpssh <SessionName> [options]
```

#### Options
List and filter all sessions
```bash
jumpssh
```

Directly filter and select session
```bash
jumpssh <SessionName>
```

Create session
```bash
jumpssh -c
```

Delete session
```bash
jumpssh -d
```

Help
```bash
jumpssh -h
```
