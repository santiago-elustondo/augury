// @todo: weird issues with this module. importing build file against webpack's recommendations
const stringifier = require('stringifier/build/stringifier');
const stringify = stringifier({ indent: ' ' });

/**
 *  a DiagPacket represents the diagnosis results
 *    for a single execution event of a diagnosable function.
 *  DiagPackets are serializable.
 */
export class DiagPacket {
  end: 'frontend' | 'backend';
  header: string;
  startTime: number;
  endTime: number;
  pre: DiagnosticSectionResult;
  post: DiagnosticSectionResult;
  diagError?: { section, error };
  exception: any;
}

/**
 *  DiagnosticSectionResults contain arrays of statements of the following types
 *    full type definitions below.
 */
export enum STATEMENT_TYPE {
    ASSERTION,
    PLAIN_TEXT
}

/**
 *  a diagnostic section represents the result of the execution of a section of diagnostic code.
 *    sections like 'pre' and 'post' execute before and after the target function respectively.
 */
class DiagnosticSectionResult {
  statements: Array<Statement>;
  snapshots: {}; // Map < K: string: name of inspected object, string: stringified object >
}

abstract class Statement {
  type: STATEMENT_TYPE;
}

class Assertion extends Statement {
  type = STATEMENT_TYPE.ASSERTION;
  constructor(
    public label: string,
    public pass: boolean
  ) { super(); }
}

class Plaintext extends Statement {
  type = STATEMENT_TYPE.PLAIN_TEXT;
  constructor(
    public text: string
  ) { super(); }
}

/**
 *  this exists to facilitate the correct creation of DiagPackets.
 *  after all the data has been supplied, the `finish()` method will return
 *    a serializable DiagPacket. at this point the DiagPacketConstructor
 *    instance can be thrown out.
 */
export class DiagPacketConstructor extends DiagPacket {

  constructor() {
    super();
    this.header = '';
    this.pre =  { statements: [], snapshots: {}, };
    this.post = { statements: [], snapshots: {}, };
    this.diagError = undefined;
    this.exception = undefined;
  }

  setHeader = (txt: string) => {
    this.header = txt;
  }

  setEnd = (end: 'frontend' | 'backend') => {
    this.end = end;
  }

  setStartTime = (timestamp:number) => {
    this.startTime = timestamp;
  }

  setEndTime = (timestamp:number) => {
    this.endTime = timestamp;
  }

  setException = e => {
    this.exception = e.toString();
  }

  setDiagError = ({ section, error }) => {
    error = error.toString();
    this.diagError = { section, error };
  }

  getSectionMethods = (section: 'pre'|'post') => ({
    addPlaintext: (txt: string) =>
      this[section].statements.push(new Plaintext(txt)),
    addAssertion: (label: string, pass: boolean) =>
      this[section].statements.push(new Assertion(label, pass)),
    inspect: (vals) => Object.keys(vals)
      .forEach(k => this[section].snapshots[k] = stringify(vals[k]))
  })

  finish = (): DiagPacket => ({
    end: this.end,
    header: this.header,
    startTime: this.startTime,
    endTime: this.endTime,
    pre: this.pre,
    post: this.post,
    exception: this.exception,
    diagError: this.diagError,
  })

}
