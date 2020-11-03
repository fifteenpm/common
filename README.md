# fifteen-common

## It's A Shared Library

This repo hosts UI and Webgl elements and tools for gltd sites.

This "common" package can grow and be cleaned up organically. 

* Much of the code in the Utils, for instance, could be further categorized.
* The UI repo could be removed to a design-system repo.

It includes big chunks of the fifteen.pm and globally.ltd UI and visual pallete.

## It's A Submodule and a Data Store 😬

Because we haven't tackled media management in a comprehensive way, this repo does not work as an actual package but for the time being as a submodule to be embedded into the directory structure of a gltd site.

For the same reason, this repo also requires `git-lfs` for the `assets` dir.

The parent repo handles builds. Check out the webpack config for fifteen.pm for an example.

To step out of this way of doing things, we will first need to actually migrate all fifteen.pm assets into this repo. Then we can more comprehensively manage data across globally.ltd and fifteen.pm.

