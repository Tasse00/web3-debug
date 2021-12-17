``` tsx

// ContractDebugProvider
// - contract
// - querys

// ERC721
<ContractDebugProvider address={"0x...."} abi={[...]}>
  <TopSideContent
    top={
      <ERC721Info />
    }
    side={
      <MethodList />
    }
    content={
      <QeuryPanel />
    }
  >
</ContractDebugProvider>

```


---

# umi project

## Getting Started

Install dependencies,

```bash
$ yarn
```

Start the dev server,

```bash
$ yarn start
```
