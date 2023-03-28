
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
    import { IDFFormatterSettings }
        from "./main"

//
// ─── CONSTANTS ──────────────────────────────────────────────────────────────────
//

    const LINE_BREAK =
        "\n"

//
// ─── SERIALIZER ─────────────────────────────────────────────────────────────────
//

    export function serializeIDF ( settings: IDFFormatterSettings,
                                    entries: IDFEntry[ ] ): string {
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        const size =
            entries.length
        const LINE_BREAKS_ON_TOP =
            LINE_BREAK.repeat( settings.emptyLinesBetweenEntries )
        const serializedEntries =
            new Array<string> ( size )
        let previousWasComment =
            false

        for ( let i = 0; i < size; i++ ) {
            const entry =
                entries[ i ]!
            if ( entry.length === 1 && entry[ 0 ]![ 0 ] === null ) {
                serializedEntries[ i ] =
                    ( previousWasComment ? "" : LINE_BREAKS_ON_TOP ) + entry[ 0 ]![ 1 ]
                previousWasComment =
                    true
            } else {
                serializedEntries[ i ] =
                    serializeEntry( entries[ i ]!, settings, LINE_BREAKS_ON_TOP )
                previousWasComment =
                    false
            }
        }

        return serializedEntries.join( LINE_BREAK ) + LINE_BREAK
    }

//
// ─── SERIALIZE ENTRY ────────────────────────────────────────────────────────────
//

    function serializeEntry ( entry: IDFEntry,
                           settings: IDFFormatterSettings,
                 LINE_BREAKS_ON_TOP: string ): string {
        //  - - - - - - - - - - - - - - - - - - - - - -
        const size =
            entry.length
        const lines =
            new Array<string> ( size )
        // name line
        // lines[ 0 ] = ( `${ entry[ 0 ]! }` )

        lines[ 0 ] = formatRow( entry[ 0 ]!, size == 1, false, settings )

        // entries
        for ( let i = 1; i < size; i++ ) {
            lines[ i ] =
                formatRow( entry[ i ]!, i + 1 == size, true, settings )
        }

        // done
        return LINE_BREAKS_ON_TOP + lines.join( LINE_BREAK )
    }

//
// ─── FORMAT VALUE AND COMMENT ───────────────────────────────────────────────────
//

    function formatRow ( [ value, comment ]: IDFEntryRow,
                                       ends: boolean,
                                       indent_or_not: boolean,
                                   settings: IDFFormatterSettings ): string {
        //  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        let indentation:string = ""
        if (indent_or_not) { 
            indentation =
            " ".repeat( settings.indentation )
        }
        

        if ( value === null ) {
            return indentation + comment
        }

        const ending =
            ends ? ";" : ","

        if ( comment === "" ) {
            return indentation + value + ending
        }

        let paddingSize:number =
            ( settings.commentColumnPadding - value.length ) - 1
        if (!indent_or_not) {
            paddingSize = paddingSize + settings.indentation
        }
        const padding =
            ( paddingSize > 0
                ? " ".repeat( paddingSize )
                : "  "
                )

        return indentation + value + ending + padding + comment
    }

// ────────────────────────────────────────────────────────────────────────────────
