// Splits a copy string into plain text, **bold** runs and staging markers
// ([TBD…], [NEEDS PROOF…], [ASSUMPTION…]) so copy can stay as data in src/content.

export type Segment =
  | { kind: 'text'; value: string }
  | { kind: 'bold'; value: string }
  | { kind: 'marker'; value: string };

const PATTERN = /(\*\*[^*]+\*\*|\[(?:TBD|NEEDS PROOF|ASSUMPTION)[^\]]*\])/g;

export function segments(input: string): Segment[] {
  return input
    .split(PATTERN)
    .filter((part) => part !== '')
    .map((part): Segment => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return { kind: 'bold', value: part.slice(2, -2) };
      }
      if (/^\[(TBD|NEEDS PROOF|ASSUMPTION)/.test(part)) {
        return { kind: 'marker', value: part };
      }
      return { kind: 'text', value: part };
    });
}

/** True when a string still holds a staging marker (used to keep unfinished answers out of structured data). */
export function hasMarker(input: string): boolean {
  return /\[(TBD|NEEDS PROOF|ASSUMPTION)/.test(input);
}

/** Plain text with markers and bold syntax stripped, for meta tags and JSON-LD. */
export function plain(input: string): string {
  return input
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\s*\[(?:TBD|NEEDS PROOF|ASSUMPTION)[^\]]*\]/g, '')
    .trim();
}
