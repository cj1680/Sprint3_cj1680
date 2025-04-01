# Mathster

# Authors
- Brianna Jackson
- Connor Jonhson
- Julian Ondrey
- Stell Shuman-Thomas
- Tyler Snow
- Akeel Hanchard
<div align="center">

<!-- ![Ignite Logo](assets/logo/ignite_logo_mixed.svg) -->

<img src="assets/logo/ignite_logo_mixed.svg" width=512>

<!-- [![image](https://travis-ci.com/pytorch/ignite.svg?branch=master)](https://travis-ci.com/pytorch/ignite) -->

| ![image](https://img.shields.io/badge/-Tests:-black?style=flat-square) [![image](https://github.com/pytorch/ignite/actions/workflows/unit-tests.yml/badge.svg?branch=master)](https://github.com/pytorch/ignite/actions/workflows/unit-tests.yml) [![image](https://github.com/pytorch/ignite/actions/workflows/gpu-tests.yml/badge.svg)](https://github.com/pytorch/ignite/actions/workflows/gpu-tests.yml) [![image](https://codecov.io/gh/pytorch/ignite/branch/master/graph/badge.svg)](https://codecov.io/gh/pytorch/ignite) [![image](https://img.shields.io/badge/dynamic/json.svg?label=docs&url=https%3A%2F%2Fpypi.org%2Fpypi%2Fpytorch-ignite%2Fjson&query=%24.info.version&colorB=brightgreen&prefix=v)](https://pytorch.org/ignite/index.html) |
|:---
| ![image](https://img.shields.io/badge/-Stable%20Releases:-black?style=flat-square) [![image](https://anaconda.org/pytorch/ignite/badges/version.svg)](https://anaconda.org/pytorch/ignite) ・ [![image](https://img.shields.io/badge/dynamic/json.svg?label=PyPI&url=https%3A%2F%2Fpypi.org%2Fpypi%2Fpytorch-ignite%2Fjson&query=%24.info.version&colorB=brightgreen&prefix=v)](https://pypi.org/project/pytorch-ignite/) [![image](https://static.pepy.tech/badge/pytorch-ignite)](https://pepy.tech/project/pytorch-ignite) ・ [![image](https://img.shields.io/badge/docker-hub-blue)](https://hub.docker.com/u/pytorchignite) |
| ![image](https://img.shields.io/badge/-Nightly%20Releases:-black?style=flat-square) [![image](https://anaconda.org/pytorch-nightly/ignite/badges/version.svg)](https://anaconda.org/pytorch-nightly/ignite) [![image](https://img.shields.io/badge/PyPI-pre%20releases-brightgreen)](https://pypi.org/project/pytorch-ignite/#history)|
| ![image](https://img.shields.io/badge/-Community:-black?style=flat-square) [![Twitter](https://img.shields.io/badge/news-twitter-blue)](https://twitter.com/pytorch_ignite) [![discord](https://img.shields.io/badge/chat-discord-blue?logo=discord)](https://discord.gg/djZtm3EmKj) [![numfocus](https://img.shields.io/badge/NumFOCUS-affiliated%20project-green)](https://numfocus.org/sponsored-projects/affiliated-projects) |
| ![image](https://img.shields.io/badge/-Supported_PyTorch/Python_versions:-black?style=flat-square) [![link](https://img.shields.io/badge/-check_here-blue)](https://github.com/pytorch/ignite/actions?query=workflow%3A%22PyTorch+version+tests%22)|

</div>

## TL;DR

Ignite is a high-level library to help with training and evaluating neural networks in PyTorch flexibly and transparently.

<div align="center">

<a href="https://colab.research.google.com/github/pytorch/ignite/blob/master/assets/tldr/teaser.ipynb">
 <img alt="PyTorch-Ignite teaser"
      src="assets/tldr/pytorch-ignite-teaser.gif"
      width=532>
</a>

_Click on the image to see complete code_

</div>

### Features

- [Less code than pure PyTorch](https://raw.githubusercontent.com/pytorch/ignite/master/assets/ignite_vs_bare_pytorch.png)
  while ensuring maximum control and simplicity

- Library approach and no program's control inversion - _Use ignite where and when you need_

- Extensible API for metrics, experiment managers, and other components
