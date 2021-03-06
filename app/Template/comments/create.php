<form method="post" action="<?= $this->url->href('comment', 'save', array('task_id' => $task['id'], 'project_id' => $task['project_id'])) ?>" autocomplete="off">
    <?= $this->form->csrf() ?>
    <?= $this->form->hidden('task_id', $values) ?>
    <?= $this->form->hidden('user_id', $values) ?>

    <div class="form-tabs">
        <ul class="form-tabs-nav">
            <li class="form-tab form-tab-selected">
                <i class="fa fa-pencil-square-o fa-fw"></i><a id="markdown-write" href="#"><?= t('Write') ?></a>
            </li>
            <li class="form-tab">
                <a id="markdown-preview" href="#"><i class="fa fa-eye fa-fw"></i><?= t('Preview') ?></a>
            </li>
        </ul>
        <div class="write-area">
            <?= $this->form->textarea(
                'comment',
                $values,
                $errors,
                array(
                    'required',
                    'placeholder="'.t('Leave a comment').'"',
                    'data-mention-search-url="'.$this->url->href('UserHelper', 'mention', array('project_id' => $task['project_id'])).'"',
                ),
                'comment-textarea'
            ) ?>
        </div>
        <div class="preview-area">
            <div class="markdown"></div>
        </div>
    </div>

    <div class="form-actions">
        <button type="submit" class="btn btn-blue"><?= t('Save') ?></button>
    </div>
</form>
