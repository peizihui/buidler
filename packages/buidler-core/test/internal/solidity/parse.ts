import { assert } from "chai";

import { parse } from "../../../src/internal/solidity/parse";

describe("Solidity parser", () => {
  describe("imports", () => {
    it("should work with global imports", () => {
      const { imports } = parse(`
import "./asd.sol";
pragma experimental v0.5.0;
import "lib/asd.sol";
  `);

      assert.deepEqual(imports, ["./asd.sol", "lib/asd.sol"]);
    });

    it("should work with star imports", () => {
      const { imports } = parse(`
import * as from "./asd.sol";
pragma experimental v0.5.0;
import * as from "lib/asd.sol";
  `);

      assert.deepEqual(imports, ["./asd.sol", "lib/asd.sol"]);
    });

    it("should work with selective imports", () => {
      const { imports } = parse(`
import {symbol1} from "./asd.sol";
pragma experimental v0.5.0;
import {symbol1, symbol2} as from "lib/asd.sol";
  `);

      assert.deepEqual(imports, ["./asd.sol", "lib/asd.sol"]);
    });

    it("should work with aliased imports", () => {
      const { imports } = parse(`
import {symbol1 as s1} as from "./asd.sol";
pragma experimental v0.5.0;
import {symbol1 as s1, symbol2} as from "lib/asd.sol";
  `);

      assert.deepEqual(imports, ["./asd.sol", "lib/asd.sol"]);
    });

    it("If the syntax is invalid but there's still some valid imports' they should be returned", () => {
      const { imports } = parse(`
    asd
import "./asd.sol";
fgh {;

(

import "./1.sol";
            address a,
            uint256 b,
            bytes memory a
        ) = []
      
    `);

      assert.deepEqual(imports, ["./asd.sol", "./1.sol"]);
    });

    it("Should work when the parser doesn't detect some invalid syntax and the visitor breaks", () => {
      const { imports } = parse(`
      import "a.sol";

      contract C {
        fallback () function {

        }
      }
    `);

      assert.deepEqual(imports, ["a.sol"]);
    });
  });
});