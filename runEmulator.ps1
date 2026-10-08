$env:JAVA_HOME = "C:\Users\asafa\tools\jre21\jdk-21.0.4+7-jre"
$env:Path = "$env:JAVA_HOME\bin;" + $env:Path
$nodePath = "C:\Users\asafa\.gemini\antigravity\brain\71015db5-9a36-4d4f-8cd0-570b53efebe9\scratch\node\node-v20.11.1-win-x64\node.exe"
$npmPath = "C:\Users\asafa\.gemini\antigravity\brain\71015db5-9a36-4d4f-8cd0-570b53efebe9\scratch\node\node-v20.11.1-win-x64\npx.cmd"
$env:Path = "C:\Users\asafa\.gemini\antigravity\brain\71015db5-9a36-4d4f-8cd0-570b53efebe9\scratch\node\node-v20.11.1-win-x64;" + $env:Path

& $npmPath firebase-tools emulators:start --only firestore,auth --project apenas-continue
