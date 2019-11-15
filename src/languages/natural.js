/*
Language: NATURAL (Software AG)
Author: marioosh <marioosh@marioosh.net>
Description: NATURAL
Category: natural
*/

function(hljs) {
  var natural_keywords = 
`IF
GLOBAL USING
SUBROUTINE
END-DEFINE
FOR
END-FOR
ACCEPT
REJECT
ADD
ASSIGN
BACKOUT TRANSACTION
BEFORE BREAK PROCESSING
CALL
CALL FILE
CALL LOOP
CALLDBPROC
CALLNAT
CLOSE CONVERSATION
CLOSE PC FILE
CLOSE PRINTER
CLOSE WORK FILE
COMMIT
COMPOSE
COMPRESS
COMPUTE
CREATE OBJECT
DELETE
DISPLAY
DIVIDE
DO
DOEND
DOWNLOAD PC FILE
EJECT
^END
ESCAPE
EXAMINE
EXPAND
FIND
FOR
FORMAT
GET
GET SAME
HISTOGRAM
IF
IF SELECTION
IGNORE
INCLUDE
INPUT
INSERT
INTERFACE
LIMIT
LOOP
MERGE
METHOD
MOVE INDEXED
MOVE
MULTIPLY
NEWPAGE
OBTAIN
ON ERROR
OPEN CONVERSATION
OPTIONS
PARSE XML
PASSW
PERFORM BREAK PROCESSING
PERFORM
PRINT
PROCESS COMMAND
PROCESS PAGE
PROCESS
PROCESS SQL
PROPERTY
READ
READ RESULT SET
READ WORK FILE
READLOB
REDEFINE
REDUCE
REINPUT
REJECT
RELEASE
REPEAT
REQUEST DOCUMENT
RESET
RESIZE
RETRY
ROLLBACK
RUN
SELECT
SEND METHOD
SEPARATE
SET CONTROL
SET GLOBALS
SET KEY
SET TIME
SET WINDOW
SKIP
SORT
STACK
STOP
STORE
SUBTRACT
SUSPEND IDENTICAL SUPPRESS
TERMINATE
UPDATE
UPDATE
UPDATELOB
UPLOAD PC FILE
WRITE
VIEW
MASTER-BLOCK
RETURN
OR NOT AND
`;

var multiword_keywords = 
`VIEW\\s+OF
END-IF
END-REPEAT
END-DECIDE
MOVE\\s+BY\\s+NAME
^DEFINE\\s+DATA
^LOCAL
^DECIDE\\s+FOR
DECIDE\\s+ON
^DEFINE\\s+CLASS
^DEFINE\\s+DATA
^DEFINE\\s+FUNCTION
^DEFINE\\s+PRINTER
^DEFINE\\s+PROTOTYPE
^DEFINE\\s+WINDOW
^DEFINE\\s+WORK FILE
GET\\s+TRANSACTION\\s+DATA
END\\s+TRANSACTION
WRITE\\s+TITLE
WRITE\\s+TRAILER
WRITE\\s+WORK\\s+FILE`;

var multiword_meta = 
`\\s*DEFINE\\s+SUBROUTINE
\\sFETCH\\s+RETURN
\\sFETCH
\\s*END-SUBROUTINE`

var other_re = 
`\\*PF-KEY`

var natural_keywords_stripped = natural_keywords.replace(/(?:\r\n|\r|\n)/g, ' ');
var multiword_keywords_re = multiword_keywords.replace(/(?:\r\n|\r|\n)/g, '|');
var multiword_meta_re = multiword_meta.replace(/(?:\r\n|\r|\n)/g, '|');

var NATURAL_NUMBER_RE = '\\b' +
  '(' +
    '0[bB]([01]+[01_]+[01]+|[01]+)' + // 0b...
    '|' +
    '0[xX]([a-fA-F0-9]+[a-fA-F0-9_]+[a-fA-F0-9]+|[a-fA-F0-9]+)' + // 0x...
    '|' +
    '(' +
      '([\\d]+[\\d_]+[\\d]+|[\\d]+)(\\.([\\d]+[\\d_]+[\\d]+|[\\d]+))?' +
      '|' +
      '\\.([\\d]+[\\d_]+[\\d]+|[\\d]+)' +
    ')' +
    '([eE][-+]?\\d+)?' + // octal, decimal, float
  ')' +
  '[lLfF]?';
  var NATURAL_NUMBER_MODE = {
    className: 'number',
    begin: NATURAL_NUMBER_RE,
    relevance: 0
  };

  // 1 #ABC (N10),(D),(B4),(P9.2),(N7.2),(P2),(L)
  var TYPE_DEF = {
    className: 'type',
    begin: '\\(([ANPB]\\d+|[NP]\\d+\\.\\d+|D|L)',
    end: '\\)'
  };  
  var TYPE_DEF2 = {
    begin: '\\(',
    end: '\\)',
    contains: [
      {
        className: 'type',
        begin: '([ANPB]\\d+|[NP]\\d+\\.\\d+|D|L)',
        relevance: 10
      }
    ]
  };
  var PERFORM_CALLS = {
    className: 'keyword',
    begin: 'PERFORM\\s+',
    end: '',
    contains: [
      {
        className: 'meta',
        begin: '[A-Z0-9-_]+',
        relevance: 10
      }
    ]
  };  

  return {
    case_insensitive: true, // language is case-insensitive
    keywords: natural_keywords_stripped,
    contains: [
      {
        className: 'string',
        begin: '\'', end: '\''
      },
      PERFORM_CALLS,      
      {
        className: 'keyword',
        begin: multiword_keywords_re, end: ''
      },      
      {
        className: 'meta',
        begin: multiword_meta_re, end: ''
      },            
      {
        className: 'built_in',
        begin: other_re, end: ''
      },
      NATURAL_NUMBER_MODE,
      TYPE_DEF,
      {
        className: 'header',
        begin: '^\\-{6}\\*', end: '\n'
      },
      hljs.COMMENT('^\\*', '$'),
      hljs.COMMENT('/\\*', '$')
    ]
  };
}
