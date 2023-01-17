Image folder for embeds

![](databricks.svg)

![](pixels-diagram.svg)

```mermaid
flowchart LR

subgraph raw
    C -->|One| D[<img src='databricks.svg' width='40' height='40' />]
    C -->|Two| E[fa:fa-phone iphone]
    C -->|Three| F[fa:fa-car Car]
end
```
