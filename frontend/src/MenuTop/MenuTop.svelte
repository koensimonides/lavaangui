<script>
  import Navbar from "./Navbar.svelte";
  import FileMenu from "./FileMenu.svelte";
  import ViewMenu from "./ViewMenu.svelte";
  import EstimationMenu from "./EstimationMenu.svelte";
  import Layouts from "./Layouts.svelte";
  import AddMenu from "./AddMenu.svelte";
  import ShowHelp from "./ShowHelp.svelte";
  import GridOptions from "./GridOptions.svelte";
  import DropDownOpenhover from "./DropDownOpenhover.svelte";
  import EditMenu from "./EditMenu.svelte";
</script>

<Navbar>
  <FileMenu />
  <EditMenu />
  <ViewMenu />
  <AddMenu />
  <EstimationMenu />
  <Layouts />
  <GridOptions />
  <ShowHelp />
  <DropDownOpenhover />
</Navbar>
