<div id="match-media"></div>

# Match media
---
This library is a match media polyfill for react native. 
Note the library can be used on react native for mobile, macos and windwos because it doesnt contain any native code for a specific platform. 

<br>

### How to use the library
---
```ts

import "@react-native-extra/match-media";


const { matches } = matchMedia("(orientation: portrait)");

console.log(matches);

```

<br>

### Media feature support 
---
Here is all media feature support. Beside these media features will yield a false result.

- prefers-reduced-transparency

- prefers-reduced-motion

- inverted-colors

- prefers-color-scheme

- width

- height

- aspect-ratio

- orientation

- resolution

<br>

### Media type 
---
Here is all media type support. Beside these media type will yield a false result.

- all

- screen