<script>
  export let message = '';
  export let type = 'success'; // 'success' | 'error'
</script>

<div class={`p-3 rounded mb-4 ${type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
  {message}
</div>
