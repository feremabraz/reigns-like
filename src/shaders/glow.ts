export const glowVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const glowFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uPower;
  uniform float uYearProgress;
  uniform vec3 uAccent;
  varying vec2 vUv;

  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 0.0;

    for (int i = 0; i < 5; i++) {
      value += amplitude * sin(10.0 * (st.x + frequency) + uTime * 0.4) * cos(10.0 * (st.y - frequency) - uTime * 0.3);
      st *= 1.5;
      amplitude *= 0.5;
      frequency += 0.5;
    }

    return value;
  }

  void main() {
    vec2 uv = vUv - 0.5;
    float radius = length(uv);
    float glow = exp(-radius * (3.0 - uPower * 1.5));
    float ripples = sin((uv.x + uv.y) * 20.0 + uTime * 0.8) * 0.15;
    float energy = glow + ripples + fbm(uv * 1.5) * 0.25;
    float cadence = sin(uYearProgress * 6.2831 + uTime * 0.5) * 0.5 + 0.5;

    vec3 base = mix(vec3(0.03, 0.05, 0.12), uAccent, clamp(energy + cadence * 0.5, 0.0, 1.0));
    float alpha = clamp(energy * 0.9 + uPower * 0.2, 0.0, 0.85);

    gl_FragColor = vec4(base, alpha);
  }
`;
