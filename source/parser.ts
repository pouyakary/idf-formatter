
//
// Copyright (c) 2021 - present by Pouya Kary <pouya@kary.us>
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
//


//
// ─── TYPES ──────────────────────────────────────────────────────────────────────
//

    export type IDFEntry =
        IDFEntryRow[ ]

    /** [ value, comment ] */
    export type IDFEntryRow =
        [ string | null, string ]

//
// ─── CONSTANTS ──────────────────────────────────────────────────────────────────
//

    const COMMENT_PARSER =
        /^([^!]*)(!.+)?$/
    const COMMENT_LINE =
        /^!/
    const END_OF_LINE_SEMI_REMOVER =
        /(,|;)$/
    const EMPTY_LINE =
        /^\s*$/

//
// ─── API ────────────────────────────────────────────────────────────────────────
//

    export function parseIDF ( idfFileContent: string ): IDFEntry[ ] {
        // total result
        const entries =
            new Array<IDFEntry> ( )
        let currentEntry: IDFEntry =
            [ ]
        let insideEntry =
            false;

        const lines =
            idfFileContent.split( /(?:(?:\n\r?)|(?:\r\n?))/g )

        // parser
        for ( const line of lines ) {
            const trimmedLine =
                line.trim( )

            if ( !EMPTY_LINE.test( trimmedLine ) ) {
                const [ valuesLine, comment ] =
                    getLineAndComment( trimmedLine )

                if ( COMMENT_LINE.test( trimmedLine ) ) {
                    const row: IDFEntryRow =
                        [ null, comment ]
                    if ( insideEntry ) {
                        currentEntry.push( row )
                    } else {
                        entries.push([ row ])
                    }
                }

                else {
                    insideEntry =
                        true;
                    const justValues =
                        valuesLine.replace( END_OF_LINE_SEMI_REMOVER, "" )
                    currentEntry.push([
                        justValues, comment
                    ])

                    if ( valuesLine.endsWith( ";" ) ) {
                        insideEntry =
                            false;
                        entries.push( currentEntry )
                        currentEntry =
                            [ ]
                    }
                }
            }
        }

        // done
        return entries
    }

//
// ─── GET COMMENT AND VALUE ──────────────────────────────────────────────────────
//

    function getLineAndComment ( line: string ): [ string, string ] {
        const matches =
            line.match( COMMENT_PARSER )!
        const value =
            matches[ 1 ]!.trim( )
        const comment =
            ( matches[ 2 ] || "" ).trim( )
        return [
            value,
            comment,
        ]
    }

// ────────────────────────────────────────────────────────────────────────────────
