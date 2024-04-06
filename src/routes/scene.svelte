<script lang="ts">
  import { T } from "@threlte/core";
  import { Grid, OrbitControls, TransformControls } from "@threlte/extras";
  import * as Three from "three";
  import { DEG2RAD } from "three/src/math/MathUtils.js";
</script>

<!-- Grid -->
<Grid cellColor="#808080" sectionSize={0} />

<!-- Camera -->
<T.PerspectiveCamera position={[20, 20, 20]} fov={50} makeDefault>
  <!-- Controls -->
  <OrbitControls enableDamping />
</T.PerspectiveCamera>

<!-- Lights the scene equally -->
<T.AmbientLight color="#ffffff" intensity={0.2} />

<!-- Light that casts a shadow -->
<T.DirectionalLight
  color="#ffffff"
  intensity={2}
  position={[10, 10, 0]}
  shadow.camera.top={8}
  castShadow />

<!-- Sphere -->
<T.Mesh position={[0, 4, 0]} let:ref castShadow>
  <T.SphereGeometry args={[4, 64, 64]} />
  <T.MeshStandardMaterial color="#ffffff" />
  <TransformControls object={ref} />
</T.Mesh>

<!-- Floor -->
<T.Mesh rotation.x={DEG2RAD * 90} receiveShadow>
  <T.PlaneGeometry args={[20, 20]} />
  <T.MeshStandardMaterial color="#ffffff" side={Three.DoubleSide} />
</T.Mesh>
