
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
        [ string, string ]

//
// ─── CONSTANTS ──────────────────────────────────────────────────────────────────
//

    const COMMENT_PARSER =
        /^([^!]+)(!-.+)?$/
    const END_OF_LINE_SEMI_REMOVER =
        /(,|;)$/
    const EMPTY_LINE =
        /(?:^\!)|(?:^\s*$)/

//
// ─── API ────────────────────────────────────────────────────────────────────────
//

    export function parseIDF ( idfFileContent: string ): IDFEntry[ ] {
        // total result
        const entries =
            new Array<IDFEntry> ( )

        // temporary cache
        let currentComment =
            ""
        let currentEntry: IDFEntry =
            [ ]

        function finishEntry ( ) {
            entries.push( currentEntry )
            currentComment =
                ""
            currentEntry =
                [ ]
        }

        // parser
        for ( const line of stream_lines( idfFileContent ) ) {
            const trimmedLine =
                line.trim( )

            if ( !EMPTY_LINE.test( trimmedLine ) ) {
                const [ valuesLine, comment ] =
                    getLineAndComment( trimmedLine )
                const endsEntry =
                    valuesLine.endsWith( ";" )
                const justValues =
                    valuesLine.replace( END_OF_LINE_SEMI_REMOVER, "" )
                const values =
                    justValues.split( "," )

                if ( comment !== "" ) {
                    currentComment = comment
                }

                const size =
                    values.length
                if ( size === 1 ) {
                    currentEntry.push([ values[ 0 ], currentComment ])
                } else {
                    for ( let index = 0; index < size; index++ ) {
                        currentEntry.push([
                            values[ index ].trim( ),
                            `${ currentComment }    --- Part ${ index + 1 } of ${ size }`
                        ])
                    }
                }

                if ( endsEntry ) {
                    finishEntry( )
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
            matches[ 1 ].trim( )
        const comment =
            ( matches[ 2 ] || "" ).trim( )
        return [
            value,
            comment,
        ]
    }

//
// ─── LINE STREAMER ──────────────────────────────────────────────────────────────
//

    function * stream_lines ( wholeText: string ): Generator<string, string> {
        let current_line =
            new Array<string> ( )
        let previousCharacterWasLineBreak =
            false
        for ( const char of wholeText ) {
            if ( char === "\n" || char === "\r" ) {
                if ( !previousCharacterWasLineBreak ) {
                    yield current_line.join( "" )
                }
                previousCharacterWasLineBreak =
                    true
                current_line =
                    [ ]
            } else {
                previousCharacterWasLineBreak =
                    false
                current_line.push( char )
            }
        }
        return current_line.join( "" )
    }

// ────────────────────────────────────────────────────────────────────────────────
