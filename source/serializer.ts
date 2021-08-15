
//
// Copyright (c) 2021 - present by Pouya Kary <pouya@kary.us>
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
//


//
// ─── IMPORTS ────────────────────────────────────────────────────────────────────
//

    import { IDFEntry, IDFEntryRow }
        from "./parser"

//
// ─── CONSTANTS ──────────────────────────────────────────────────────────────────
//

    const INDENTATION =
        "   "
    const LINE_BREAK =
        "\n"

//
// ─── SERIALIZER ─────────────────────────────────────────────────────────────────
//

    export function serializeIDF ( entries: IDFEntry[ ] ): string {
        const size =
            entries.length
        const serializedEntries =
            new Array<string> ( size )

        for ( let i = 0; i < size; i++ ) {
            serializedEntries[ i ] =
                serializeEntry( entries[ i ] )
        }

        return serializedEntries.join( LINE_BREAK + LINE_BREAK )
    }

//
// ─── SERIALIZE ENTRY ────────────────────────────────────────────────────────────
//

    function serializeEntry ( entry: IDFEntry ): string {
        const size =
            entry.length
        const lines =
            new Array<string> ( size )
        // name line
        lines[ 0 ] = ( `${ entry[ 0 ]! }` )

        // entries
        for ( let i = 1; i < size; i++ ) {
            lines[ i ] =
                formatRow( entry[ i ], i + 1 == size )
        }

        // done
        return lines.join( LINE_BREAK )
    }

//
// ─── FORMAT VALUE AND COMMENT ───────────────────────────────────────────────────
//

    function formatRow ( [ value, comment ]: IDFEntryRow, ends: boolean ): string {
        const ending =
            ends ? ";" : ","

        if ( comment === "" ) {
            return INDENTATION + value + ending
        }

        const paddingSize =
            ( 30 - value.length ) - 1
        const padding =
            ( paddingSize > 0
                ? " ".repeat( paddingSize )
                : "  "
                )

        return INDENTATION + value + ending + padding + comment
    }

// ────────────────────────────────────────────────────────────────────────────────
