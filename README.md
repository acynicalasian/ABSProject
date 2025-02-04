# Overview
This is a project I made for an interview. I'll get to writing better documentation when I can, but for now, here's a quick reminder to run `npm install` in `./tmo-react` to install all the dependencies of this project.

## Known technical problems
The technical requirements called for using a unit testing framework for the frontend, but I cannot get `react-test-renderer` to work with my repository for some reason, which is hampering my use of Jest. Understanding why probably requires way deeper knowledge of the Node package manager than I'm capable of at the moment, but I did try a few steps to try and resolve the problem, which didn't work.
1. Install Jest.
```console
john@doe:~/{PROJECT_DIR}$ npm install --save-dev --force jest
```
2. Install `react-test-renderer`.
```console
john@doe:~/{PROJECT_DIR}$ npm install --save-dev --force react-test-renderer
```
3. Most of the warning messages I got were regarding me using React v19. When I ran `npm test`, it fails on tests like these with the message that I could not import from `react-test-renderer`.
```tsx
import renderer from 'react-test-renderer';
import MyComponent from './path/to/file';

it('renders correctly', () => {
  const tree = renderer
    .create(<MyComponent/>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
```
These issues prevented me from creating snapshot tests for components that are pure (those that should always behave the same on the same input). However, it does lead to my concern overall that unit testing is even suited for the frontend part of this project. Most dynamic behavior only originated from the input fields of my user interface, and client-side sanitation of input limited the program states further. I used enum-like constants in C-like `UPPERCASED` variables to visually emphasize the fact that my program only has a couple possible states, excluding user input. These program states were finite, but they tightly interconnected the various parts of my UI, and I believe this made it impractical to test components separately. Arguably, this could be bad programming design, but I left plenty of code comments explaining why I'm tracking state in a fairly bloated, core parent component due to needs for synchronization of components across renders.

Anyhow, this part of the README file aims to show that I made a good faith attempt to address one of the technical requirements of this project, and it aims to provide what I hope are conceptually solid reasons as to why the technical requirement was ill-suited for the scope of the frontend of the project.

## Third-party libraries
I used Material UI, a UI component library that supports CSS-in-JS by using Emotion. I also have Storybook installed in this project for now, but I'll probably get rid of it as I wasn't able to make use of its features effectively.

## To-do
As of now, I need to finish the component that actually displays the top seller data in a table, and after that, I just need to write unit tests for the front-end. After that, I'm mostly finished, and I'll update this documentation if I have time.
