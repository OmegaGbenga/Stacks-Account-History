import { Cl } from "@stacks/transactions";
import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("Search History Contract", () => {
  
  it("can add an address to search history", () => {
    const response = simnet.callPublicFn(
      "search-history",
      "add-to-history",
      [Cl.principal(wallet1)],
      deployer
    );
    
    expect(response.result).toBeOk(Cl.bool(true));
  });

  it("can retrieve search history", () => {
    // Add an address
    simnet.callPublicFn(
      "search-history",
      "add-to-history",
      [Cl.principal(wallet1)],
      deployer
    );
    
    // Get history
    const response = simnet.callReadOnlyFn(
      "search-history",
      "get-history",
      [Cl.principal(deployer)],
      deployer
    );
    
    // Should contain the address we added
    expect(response.result).toBeOk(Cl.list([Cl.principal(wallet1)]));
  });

  it("prevents duplicate addresses", () => {
    // Add address first time
    simnet.callPublicFn(
      "search-history",
      "add-to-history",
      [Cl.principal(wallet1)],
      deployer
    );
    
    // Try to add same address again
    const response = simnet.callPublicFn(
      "search-history",
      "add-to-history",
      [Cl.principal(wallet1)],
      deployer
    );
    
    // Should fail with error 2
    expect(response.result).toBeErr(Cl.uint(2));
  });

  it("can add multiple addresses", () => {
    // Add first address
    simnet.callPublicFn(
      "search-history",
      "add-to-history",
      [Cl.principal(wallet1)],
      deployer
    );
    
    // Add second address
    simnet.callPublicFn(
      "search-history",
      "add-to-history",
      [Cl.principal(wallet2)],
      deployer
    );
    
    // Get history
    const response = simnet.callReadOnlyFn(
      "search-history",
      "get-history",
      [Cl.principal(deployer)],
      deployer
    );
    
    // Should have both addresses
    expect(response.result).toBeOk(
      Cl.list([Cl.principal(wallet1), Cl.principal(wallet2)])
    );
  });

  it("can clear search history", () => {
    // Add an address
    simnet.callPublicFn(
      "search-history",
      "add-to-history",
      [Cl.principal(wallet1)],
      deployer
    );
    
    // Clear history
    const clearResponse = simnet.callPublicFn(
      "search-history",
      "clear-history",
      [],
      deployer
    );
    
    expect(clearResponse.result).toBeOk(Cl.bool(true));
    
    // Get history - should be empty
    const getResponse = simnet.callReadOnlyFn(
      "search-history",
      "get-history",
      [Cl.principal(deployer)],
      deployer
    );
    
    expect(getResponse.result).toBeOk(Cl.list([]));
  });
});