
//
// Copyright (c) 2021 - present by Pouya Kary <pouya@kary.us>
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
//


//
// ─── IMPORTS ────────────────────────────────────────────────────────────────────
//

    import { parseIDF }
        from "./parser"
    import { serializeIDF }
        from "./serializer"

//
// ─── TYPES ──────────────────────────────────────────────────────────────────────
//

    export interface IDFFormatterSettings {
        indentation:                number,
        commentColumnPadding:       number,
        emptyLinesBetweenEntries:   number,
    }

//
// ─── API ────────────────────────────────────────────────────────────────────────
//

    export function formatIDF ( idf: string,
                          settings?: Partial<IDFFormatterSettings> ): string {
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        const internalSettings =
            fixSettings( settings )
        const parseTree =
            parseIDF( idf )
        const serializedIDF =
            serializeIDF( internalSettings, parseTree )
        return serializedIDF
    }

//
// ─── PARSE AND FIX SETTINGS ─────────────────────────────────────────────────────
//

    function fixSettings ( setting?: Partial<IDFFormatterSettings> ): IDFFormatterSettings {
        const finalSettings: IDFFormatterSettings = {
            indentation:                4,
            commentColumnPadding:       30,
            emptyLinesBetweenEntries:   1,
        }

        if ( setting === undefined ) {
            return finalSettings
        }

        const { indentation, commentColumnPadding, emptyLinesBetweenEntries } =
            setting

        if ( indentation && typeof indentation === "number" ) {
            finalSettings.indentation =
                Math.floor( indentation )
        }

        if ( commentColumnPadding && typeof commentColumnPadding === "number" ) {
            if ( commentColumnPadding > 20 ) {
                finalSettings.commentColumnPadding =
                    Math.floor( commentColumnPadding )
            }
        }

        if ( emptyLinesBetweenEntries && typeof emptyLinesBetweenEntries === "number" ) {
            if ( emptyLinesBetweenEntries > 1 ) {
                finalSettings.emptyLinesBetweenEntries =
                    Math.floor( emptyLinesBetweenEntries )
            }
        }

        return finalSettings
    }

// ────────────────────────────────────────────────────────────────────────────────
