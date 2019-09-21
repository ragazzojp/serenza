# Serenza

Serenza is the codename of this project.
It's not clear if one day it will have an official name.

## What is it

The project will be described at a later stage.

So far, they're only flashing words.

## Word lists

Word lists are taken from:

- https://github.com/hermitdave/FrequencyWords

That are in turn generated using content from:

- http://opus.nlpl.eu/OpenSubtitles2018.php

Word likts are processed with the `filterwords.py` script to format
the lists in JSON by selecting only words that a minimum number of references.

The default parameter of 150 references seems to provide decent results.

Only IT, EN, FR and DE are supported, but new languages
can be easily added by filtering and converting one of the
files in the `FrequencyWords` repository.
