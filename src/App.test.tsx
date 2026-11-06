import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import App from './App';
import { projectsList } from './shared/constants/projects';

describe('App', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('renders navigation and pages', () => {
    render(<App />);

    expect(screen.getByText(/Portfolio/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Projects/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Contacts/i })).toBeInTheDocument();
  });

  it('renders the 404 page for an unknown route', async () => {
    window.history.pushState({}, '', '/this-page-does-not-exist');
    render(<App />);

    expect(await screen.findByRole('heading', { level: 1, name: '404' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'На главную' })).toBeInTheDocument();
  });

  /**
   * Проверяет, что ленивые страницы загружаются по своим маршрутам:
   * после загрузки чанков рендерятся список проектов, страница проекта и контакты.
   */
  it('lazily loads the projects, project details and contacts pages', async () => {
    // Страница списка проектов
    window.history.pushState({}, '', '/projects');
    const projectsView = render(<App />);
    const sectionHeadings = await projectsView.findAllByRole('heading', { level: 2 });
    expect(sectionHeadings[0]).toHaveTextContent('Projects');
    projectsView.unmount();

    // Детальная страница проекта с заголовком из данных
    window.history.pushState({}, '', `/project/${projectsList[0].id}`);
    const projectView = render(<App />);
    const projectTitle = await projectView.findByRole('heading', { level: 1 });
    expect(projectTitle).toHaveTextContent(projectsList[0].title);
    projectView.unmount();

    // Страница контактов с секциями Telegram и Email
    window.history.pushState({}, '', '/contacts');
    const contactsView = render(<App />);
    expect(
      await contactsView.findByRole('heading', { level: 2, name: /^Telegram:/ }),
    ).toBeInTheDocument();
    expect(contactsView.getByRole('heading', { level: 2, name: /^Email:/ })).toBeInTheDocument();
  });
});
