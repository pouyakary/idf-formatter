
# IDF Formatter

A formatter engine that formats the EnergyPlus "Input Data File" (IDF)

```ts
import { formatIDF } from "idf-formatter"

const formattedIDFText =
    formatIDF( idfText )

// You can also provide these settings:
const formattedIDFText =
    formatIDF( idfText, {
        indentation:                4,  // default
        commentColumnPadding:       30, // default
        emptyLinesBetweenEntries:   1,  // default
    })

```