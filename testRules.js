import { initializeTestEnvironment, assertFails, assertSucceeds } from "@firebase/rules-unit-testing";
import fs from "fs";
import path from "path";

let testEnv;

async function runTests() {
  const projectId = "apenas-continue";
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules: fs.readFileSync("firestore.rules", "utf8"),
      host: "127.0.0.1",
      port: 8080,
    },
  });

  const alice = testEnv.authenticatedContext("alice", { email: "alice@test.com" });
  const bob = testEnv.authenticatedContext("bob", { email: "bob@test.com" });
  const unauth = testEnv.unauthenticatedContext();
  const gestor = testEnv.authenticatedContext("gestor", { email: "asafalmeida2013@gmail.com" });

  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await db.doc("gestores/asafalmeida2013@gmail.com").set({ role: "gestor" });
  });

  console.log("Running Rules Tests...");
  let results = [];
  
  async function test(name, user, pathStr, op, expectedSucceed, p) {
    try {
      if (expectedSucceed) {
        await assertSucceeds(p);
      } else {
        await assertFails(p);
      }
      results.push(`| ${user} | \`${pathStr}\` | ${op} | ${expectedSucceed ? 'SUCESSO' : 'RECUSA'} | ${expectedSucceed ? 'SUCESSO' : 'RECUSA'} (Passou) |`);
    } catch (e) {
      results.push(`| ${user} | \`${pathStr}\` | ${op} | ${expectedSucceed ? 'SUCESSO' : 'RECUSA'} | FALHOU (${e.message}) |`);
    }
  }

  // Posts
  await test("Create Post (own)", "alice", "posts/1", "CREATE", true, alice.firestore().doc("posts/1").set({ authorId: "alice", text: "h" }));
  await test("Create Post (other)", "alice", "posts/2", "CREATE", false, alice.firestore().doc("posts/2").set({ authorId: "bob", text: "h" }));
  await test("Delete Post (own)", "alice", "posts/1", "DELETE", true, alice.firestore().doc("posts/1").delete());
  
  // Gestor
  await test("Gestor write proj", "gestor", "gestor_projetos/1", "CREATE", true, gestor.firestore().doc("gestor_projetos/1").set({ name: "Proj" }));
  await test("Normal read proj", "alice", "gestor_projetos/1", "READ", false, alice.firestore().doc("gestor_projetos/1").get());
  await test("Gestor read proj", "gestor", "gestor_projetos/1", "READ", true, gestor.firestore().doc("gestor_projetos/1").get());

  // Plans
  await test("Create Plan (own)", "alice", "plans/team1_alice_0", "CREATE", true, alice.firestore().doc("plans/team1_alice_0").set({ uid: "alice" }));
  await test("Create Plan (other)", "bob", "plans/team1_alice_1", "CREATE", false, bob.firestore().doc("plans/team1_alice_1").set({ uid: "alice" }));
  
  // Cycles
  await test("Create Cycle (own)", "alice", "cycles/team1_alice_1", "CREATE", true, alice.firestore().doc("cycles/team1_alice_1").set({ uid: "alice" }));
  await test("Create Cycle (other)", "bob", "cycles/team1_alice_2", "CREATE", false, bob.firestore().doc("cycles/team1_alice_2").set({ uid: "alice" }));

  // Estatutos_progresso
  await test("Write quiz score (own)", "alice", "users/alice/estatutos_progresso/quiz", "CREATE", true, alice.firestore().doc("users/alice/estatutos_progresso/quiz").set({ bestScore: 5 }));
  await test("Write quiz score (other)", "bob", "users/alice/estatutos_progresso/quiz", "CREATE", false, bob.firestore().doc("users/alice/estatutos_progresso/quiz").set({ bestScore: 5 }));
  await test("Read quiz score (own)", "alice", "users/alice/estatutos_progresso/quiz", "READ", true, alice.firestore().doc("users/alice/estatutos_progresso/quiz").get());
  await test("Read quiz score (other)", "bob", "users/alice/estatutos_progresso/quiz", "READ", false, bob.firestore().doc("users/alice/estatutos_progresso/quiz").get());

  // Gestores list
  await test("Read gestores list", "gestor", "gestores", "LIST", false, gestor.firestore().collection("gestores").get());

  const md = `# Resultado dos Testes de Segurança

| Usuário | Caminho | Operação | Esperado | Obtido |
|---------|---------|----------|----------|--------|
${results.join("\n")}
`;

  if (!fs.existsSync("docs")) fs.mkdirSync("docs");
  fs.writeFileSync("docs/TESTE_REGRAS_RESULTADO.md", md);

  console.log("ALL TESTS FINISHED.");
  process.exit(0);
}

runTests().catch(e => {
  console.error("TEST FAILED", e);
  process.exit(1);
});
