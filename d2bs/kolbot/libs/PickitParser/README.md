# PickitParser

TODO

## Table of Contents

* [**Data Structures**](#data-structures)
    * [Pickit Config](#pickit-config)
    * [Pickit Entry](#pickit-entry)
    * [Mods](#mods)
* [**Authors**](#authors)

Linting

```
$ eslint --ext .js --color . ./src
```

<a name="data-structures"></a>
## Data Structures

TODO

<a name="pickit-config"></a>
#### Pickit Config

By default the configuration file is `pickit.json`. This file will contain all pickit configurations. A configuration is just an `Array` of [**Pickit Entries**](#pickit-entry).

Example:

Here's an example of how a configuration file might look. Here we have 2 pickit configurations (`testConfig` & `gems`).

```json
{
    "testConfig": [
        {
            "enabled": true,
            "name": "Short Sword"
        },
        {
            "enabled": true,
            "name": "Buckler"
        }
    ],
    "gems": [
        {
            "enabled": true,
            "name": "Flawless Skull"
        }
    ]
}
```

<a name="pickit-entry"></a>
#### Pickit Entry

| Field | Type | Description | Required
| :---: | :---: | :---: | :---: |
| `enabled` | `Boolean` | Determines if the entry should be picked up | Yes
| `name` | `String` | The name of the item. This is the value returned by `unit.name` | No
| `quality` | `Number` | An enum describing the quality of the item. This value is returned by `unit.quality` | No
| `color` | `Number` | An enum describing the color of the item. This value is returned by `unit.getColor()` | No
| `mods` | `Array<Mod>` | An array of mods that should be checked against. [See the Mods documentation for information about this type](#mods). | No

<a name="mods"></a>
#### Mods

TODO

## Authors

* ross-weir