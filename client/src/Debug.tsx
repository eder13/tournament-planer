import { useEffect, useState } from 'react';
import { Link } from 'react-router';

function Page1() {
    const [count, setCount] = useState(0);
    const [id, setId] = useState(-1);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const [idPut, setIdPut] = useState(-1);
    const [titlePut, setTitlePut] = useState('');
    const [contentPut, setContentPut] = useState('');
    const [rating, setRating] = useState(0);

    useEffect(() => {
        fetch('/profile')
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                setId(res.id);
            });
    }, []);

    return (
        <>
            <Link to="/about">Go To Page 2</Link>

            <br />
            <br />
            <br />
            <br />

            <div>
                <a
                    href="https://vite.dev"
                    target="_blank"
                >
                    <img
                        src={'viteLogo'}
                        className="logo"
                        alt="Vite logo"
                    />
                </a>
                <a
                    href="https://react.dev"
                    target="_blank"
                >
                    <img
                        className="logo react"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
                <p>Environment is Dev: {import.meta.env.DEV ? 'yes' : 'no'}</p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
            <a href="/login">Login</a>

            <form
                onSubmit={(e) => {
                    e.preventDefault();

                    fetch('/recipes', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId: id,
                            title,
                            content,
                        }),
                    })
                        .then((res) => console.log(res))
                        .catch((e) => console.log(e));
                }}
            >
                <h3>Checking Post Recipe route</h3>
                <label htmlFor="id">Id</label>
                <input
                    id="id"
                    readOnly
                    value={id}
                />
                <label htmlFor="title">title</label>
                <input
                    onChange={(e) => setTitle(e.target.value)}
                    id="title"
                    value={title}
                />
                <label htmlFor="content">content</label>
                <input
                    onChange={(e) => setContent(e.target.value)}
                    id="content"
                    value={content}
                />
                <input
                    type="submit"
                    value="submit"
                />
            </form>

            <form
                onSubmit={(e) => {
                    e.preventDefault();

                    fetch('/recipes/3', {
                        method: 'delete',
                    })
                        .then((res) => console.log(res))
                        .catch((e) => console.log(e));
                }}
            >
                <h3>Delete Endpoint Recipe</h3>
                <input type="submit" />
            </form>

            <form
                onSubmit={(e) => {
                    e.preventDefault();

                    fetch(`/recipes/${idPut}`, {
                        method: 'put',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            id: idPut,
                            title: titlePut,
                            content: contentPut,
                        }),
                    })
                        .then((res) => console.log(res))
                        .catch((e) => console.log(e));
                }}
            >
                <h3>Checking PUT For recipes</h3>
                <label htmlFor="id">Id</label>
                <input
                    type="number"
                    id="id"
                    onChange={(e) => setIdPut(Number(e.target.value))}
                    value={idPut}
                />
                <label htmlFor="title">title</label>
                <input
                    id="title"
                    onChange={(e) => setTitlePut(e.target.value)}
                    value={titlePut}
                />
                <label htmlFor="content">content</label>
                <input
                    id="content"
                    onChange={(e) => setContentPut(e.target.value)}
                    value={contentPut}
                />
                <input type="submit" />
            </form>

            <form
                method="post"
                action="/logout"
            >
                <input
                    value="Logout"
                    type="submit"
                />
            </form>

            <form
                onSubmit={async (e) => {
                    e.preventDefault(); // verhindert das normale Abschicken des Formulars

                    console.log(e.target);

                    const fileInput = document.getElementById('fileInput');
                    const formData = new FormData();
                    // @ts-ignore
                    formData.append('file', fileInput?.files?.[0]); // Nur eine Datei

                    // example mit additional info
                    formData.append(
                        'meta',
                        JSON.stringify({
                            id,
                            title: 'thetitle',
                            content: 'thecontent',
                        })
                    );

                    try {
                        const response = await fetch('/upload', {
                            method: 'POST',
                            body: formData,
                            // KEIN Content-Type setzen – browser setzt boundary automatisch
                        });

                        if (response.ok) {
                            const result = await response.text(); // oder .json(), wenn JSON erwartet wird
                            console.log('Upload erfolgreich:', result);
                        } else {
                            console.error(
                                'Upload fehlgeschlagen:',
                                response.statusText
                            );
                        }
                    } catch (err) {
                        console.error('Fehler beim Hochladen:', err);
                    }
                }}
            >
                <label htmlFor="fileInput">Datei auswählen:</label>
                <input
                    type="file"
                    name="file"
                    id="fileInput"
                    required
                />
                <button type="submit">Hochladen</button>
            </form>

            <form
                onSubmit={async (e) => {
                    e.preventDefault();

                    const result = await fetch('/recipe/rate/2', {
                        // 2-> recipe Id
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            rating,
                        }),
                    });
                    const text = await result.text();
                    console.log('The result: ', text);
                }}
            >
                <h1>Rating System</h1>
                <label htmlFor="rating">Rating</label>
                <input
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    type="number"
                />
                <input
                    type="submit"
                    value="Submit Rating"
                />
            </form>
        </>
    );
}

export default Page1;
