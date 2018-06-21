# Search application for DCAT-AP-NO 1.1

Docker image: [dcatno/search](https://hub.docker.com/r/dcatno/search/)
Base image: [node:6.11]()
Source: [Dockerfile](https://github.com/Informasjonsforvaltning/fdk/blob/master/applications/search/Dockerfile)

Provides query and filtering capabilities for searching a collection of DCAT catalogs and concepts.
The search application access a search-api and a database cluster (elasticsearch/fuseki) and presents search results to the user in a web ui.


## License
dcatno/search: [Apache License, version 2.0](http://www.apache.org/licenses/LICENSE-2.0)

## Use

`docker run -p 8080:8080 dcatno/search`

To run locally:

1. Run ```npm run dev``` or run ```npm run server``` to start server.

2. Open browser ```http://localhost:3000```

3. Run ```npm run build``` to build webpack bundle.

4. Run ```npm run test``` to run tests.

## Depends on

  * search-api
  * reference-data
  * fuseki
  
## Search
  
Frontend built on React 16 and Redux. Tests are written with Mocha and Enzyme. ESLint with AirBnB used for linting.

The search application do search by calling the RESTful service from search-api.

## Universal design

The design follows the WCAG 2.0 level A standard for the universal design of websites, see [WCAG 2.0](https://www.w3.org/TR/WCAG20/)


Tar utgangspunkt i denne kravlisten som oppfyller Nivå A krav:
Based on the demands in this list which fullfills the level A requirements:


1.1 Provide text alternatives for any non-text content so that it can be changed into other forms people need, such as large print, braille, speech, symbols or simpler language.

1.2.1 For prerecorded audio-only and prerecorded video-only media, the following are true, except when the audio or video is a media alternative for text and is clearly labeled as such

1.2.2 Captions are provided for all prerecorded audio content in synchronized media, except when the media is a media alternative for text and is clearly labeled as such.

1.3.1  Information, structure, and relationships conveyed through presentation can be programmatically determined or are available in text. (tables and forms)

1.3.2 When the sequence in which content is presented affects its meaning, a correct reading sequence can be programmatically determined

1.3.3  Instructions provided for understanding and operating content do not rely solely on sensory characteristics of components such as shape, size, visual location, orientation, or sound.

1.4.1 Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. 

1.4.2  If any audio on a Web page plays automatically for more than 3 seconds, either a mechanism is available to pause or stop the audio, or a mechanism is available to control audio volume independently from the overall system volume level

1.4.3 The visual presentation of text and images of text has a contrast ratio of at least 4.5:1

1.4.4 Except for captions and images of text, text can be resized without assistive technology up to 200 percent without loss of content or functionality.

1.4.5 If the technologies being used can achieve the visual presentation, text is used to convey information rather than images of text 

2.1.1 All functionality of the content is operable through a keyboard interface without requiring specific timings for individual keystrokes, except where the underlying function requires input that depends on the path of the user's movement and not just the endpoints.

2.1.2 If keyboard focus can be moved to a component of the page using a keyboard interface, then focus can be moved away from that component using only a keyboard interface, and, if it requires more than unmodified arrow or tab keys or other standard exit methods, the user is advised of the method for moving focus away.

2.2.1 The user is allowed to adjust the time limit n

2.2.2 For any moving, blinking or scrolling information that (1) starts automatically, (2) lasts more than five seconds, and (3) is presented in parallel with other content, there is a mechanism for the user to pause, stop, or hide it 

2.3.1  Web pages do not contain anything that flashes more than three times in any one second period, or the flash is below the general flash and red flash thresholds.

2.4.1 A mechanism is available to bypass blocks of content that are repeated on multiple Web pages

2.4.2 Web pages have titles that describe topic or purpose.

2.4.3 If a Web page can be navigated sequentially and the navigation sequences affect meaning or operation, focusable components receive focus in an order that preserves meaning and operability

2.4.4  The purpose of each link can be determined from the link text alone or from the link text together with its programmatically determined link context, except where the purpose of the link would be ambiguous to users in general.

2.4.5 More than one way is available to locate a Web page within a set of Web pages except where the Web Page is the result of, or a step in, a process.

2.4.6 Headings and labels describe topic or purpose

2.4.7 Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is visible.

3.1.1 The default human language of each Web page can be programmatically determined.

3.1.2 The human language of each passage or phrase in the content can be programmatically determined except for proper names, technical terms, words of indeterminate language, and words or phrases that have become part of the vernacular of the immediately surrounding text. 

3.2.1 When any component receives focus, it does not initiate a change of context.

3.2.2 Changing the setting of any user interface component does not automatically cause a change of context unless the user has been advised of the behavior before using the component. 

3.2.3 Navigational mechanisms that are repeated on multiple Web pages within a set of Web pages occur in the same relative order each time they are repeated, unless a change is initiated by the user.

3.2.4 Components that have the same functionality within a set of Web pages are identified consistently.

3.3.1 If an input error is automatically detected, the item that is in error is identified and the error is described to the user in text.

3.3.2  Labels or instructions are provided when content requires user input. 

3.3.3 If an input error is automatically detected and suggestions for correction are known, then the suggestions are provided to the user, unless it would jeopardize the security or purpose of the content.

3.3.4 For Web pages that cause legal commitments or financial transactions for the user to occur, that modify or delete user-controllable data in data storage systems, or that submit user test responses

4.1.1 In content implemented using markup languages, elements have complete start and end tags, elements are nested according to their specifications, elements do not contain duplicate attributes, and any IDs are unique, except where the specifications allow these features.

4.1.2 For all user interface components (including but not limited to: form elements, links and components generated by scripts), the name and role can be programmatically determined; states, properties, and values that can be set by the user can be programmatically set; and notification of changes to these items is available to user agents, including assistive technologies. 
