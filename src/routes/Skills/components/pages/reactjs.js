import React, {Component} from 'react'

export default props => (
  <div>
    <h2><a href="https://facebook.github.io/react">React</a></h2>
    <p>
      <strike>Sometimes</strike> Often at my job I get sucked into ops or frontend (I wear many hats).
      Once upon a time I was directed to build the frontend to a rather complex calendaring/scheduling system
      for internal use.
      It was <em>just</em> complex enough that I didn't think the current in-house toolchains would be a good fit.
    </p>
    <p>
      Even though ReactJS has yet to fully catch on on the east coast,
      I decided to give it a spin knowing that if it sucked I could always try Angular next.
    </p>
    <h3>I ended up loving it for two reasons:</h3>
    <ol>
      <li>
        It's fun to write
      </li>
      <li>
        It makes me more productive at frontend development
      </li>
    </ol>
    <h2><a href="https://facebook.github.io/flux">Flux</a></h2>
    <p>
      I use more than one flux implementation, where my choice depends on the problem at hand.
      Word on the street is that facebook does this too, so I guess I'm probably not doing it wrong
    </p>
    <h3><a href="http://redux.js.org">Redux</a></h3>
    <p>
      For single page apps, I love Redux for these reasons:
    </p>
    <ol>
      <li>
        Purely functional code: if you're wondering how something works,
        you can play follow the stack frames and see pretty easily what's going on.
      </li>
      <li>
        Their <a href="https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en">development
        tools</a> are awesome.
      </li>
      <li>
        You don't have to worry about hooking stores up to talk to each other because you can only use one store.
      </li>
      <li>
        No <a
        href="https://stackoverflow.com/questions/29824908/what-does-dehydrate-and-rehydrate-stand-for-in-fluxible">hydrate/dehydrate
        nonsense</a>:
        your state has to be (de)serializable to pure JSON.
      </li>
      <li>
        Isomorphic rendering won't make you want to change career paths. It's still a pain to get set up, though.
      </li>
    </ol>
    <h3><a href="https://facebook.github.io/flux/docs/flux-utils.html">Vanilla</a></h3>
    <p>When I have to write components that live inside legacy (brownfield) environments, I just use facebook's
      dispatcher and wire it up manually. No need for a firehose if there's not a fire.</p>
  </div>
)
