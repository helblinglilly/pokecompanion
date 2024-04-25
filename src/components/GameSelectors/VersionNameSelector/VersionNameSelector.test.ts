/**
 * @vitest-environment jsdom
 */
// import { render, screen, waitFor } from "@testing-library/svelte";
// import EvolutionChain from ".";
// import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
// // import { setupServer } from 'msw/node'
// import { HttpResponse, http } from 'msw'
// import EvolutionChain1 from "./mocks/evolutionChain1";

// export const restHandlers
//  = [http.get('https://evolution.chain/1', () => {
//     return HttpResponse.json(EvolutionChain1)
//   }),
// ]

// // const server = setupServer(...restHandlers);

// // beforeAll(() => server.listen());
// // afterEach(() => server.resetHandlers());
// // afterAll(() => server.close());

// describe("EvolutionChain", () => {

//     it("shows the todo text when rendered", async () => {
//         render(EvolutionChain, { props: { evolutionChainUrl: 'https://evolution.chain/1' } });
//         expect(1).toBe(1);
//         // expect(screen.getByText(/https:\/\/evolution\.chain\/1/i)).to.exist;

//         // await waitFor(() => {
//         //     expect(screen.getByText(/Level 20/i)).to.exist;
//         //   });
//     });
// });