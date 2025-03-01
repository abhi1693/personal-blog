// Renders the Open Graph image used on the home page

export const width = 1200
export const height = 630

export function OpenGraphImage(props: { title: string }) {
  const { title } = props
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: 'white',
        backgroundImage:
          'radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)',
        backgroundSize: '100px 100px',
        backgroundPosition: '0 -8px, 0 -8px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontWeight: 'bold',
            color: 'black',
            background: '#fff',
            padding: '10px 20px',
          }}
        >
          Abhimanyu Saharan
        </div>
        <div
          style={{
            fontSize: 40,
            color: 'black',
            background: '#fff',
            padding: '10px 20px',
            marginTop: 20,
          }}
        >
          {title}
        </div>
      </div>
    </div>
  )
}
