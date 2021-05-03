Requirements
1. You should only use vanilla javascript and html and css to write the confirmation dialog
component without using any library.
2. The confirmation dialog component should be reusable. In other words, you should be able to
put multiple buttons on the main page and when you click them you can show the confirmation
dialog with different messages. There shouldn’t be any conflicts between your component
instances.
3. As a component, the confirmation dialog should be able to accept a message as a parameter
from the consumer to display in the modal. It also should return the result (e.g. confirmed or not)
to the consumer after the user clicks the buttons.

4. As a consumer, the main page should be able to get the result of the component and do
whatever actions accordingly (in this case is to display the according message on the page, but
in the real world it can be anything like delete a record, update data etc.)
5. The component and the consumer should be loose coupled. For example, don’t hard code
the logic in the confirmation dialog component to change the text of the main page.
6. When the confirmation dialog shows, it should cover the entire main page. All other elements
on the main page shouldn’t be clickable when the dialog displays.
7. Create a git repo in either Github, Gitlab, Bitbucket etc. Commit & push as you would for
normally, we expect to see at least a few separate commits.
8. Please use Loom to record a short, 2 minutes high-level walkthrough for your solution
9. Please share a link to the repo with your code and link to your Loom video via email to
steven.robinson@clearcalcs.com

Extras:

## Vague requirements:

### APIs/syntaxes choices:

1. With a dialog service

```ts
  DialogService.open({ ...configuration })
```

2. With direct constructor invocation

```ts
  new Dialog({ ...configuration, host: someElement })
```

## Preferences:

A dialog service for:
  - dialog component construction encapsulation. Can hide away the concrete implementation of a dialog component
  - limited surface API for better maintainability. (todo: what's the right term to describe the benefits of a small surface API set?)

###
