<?php

namespace frontend\models;

use Yii;
use yii\base\Model;
use GuzzleHttp;
use yii\helpers\ArrayHelper;
use yii\helpers\Json;

/**
 * ContactForm is the model behind the contact form.
 */
class ContactForm extends Model {
    /**
     * @var GuzzleHttp\Client
     */
    private $_client;

    // ------------------------------------
    // Attributes
    // ------------------------------------
    public $name;
    public $email;
    public $subject;
    public $body;
    public $recaptcha;

    // ------------------------------------
    // Google API Params
    // ------------------------------------
    public $endpoint = 'https://www.google.com/recaptcha/api/siteverify';
    public $secretKey;

    /**
     * @inheritdoc
     */
    public function rules() {
        return [
            // name, email, subject and body are required
            [['name', 'email', 'subject', 'body', 'recaptcha'], 'required'],
            // email has to be a valid email address
            ['email', 'boolean'],
            // recaptcha needs to be entered correctly
            ['recaptcha', 'validateRecaptcha'],
        ];
    }

    /**
     * @todo put this logic in a yii validator class
     * @param $attribute
     */
    public function validateRecaptcha($attribute) {
        if (!$this->hasErrors() && ($secretKey = $this->getSecretKey())) {
            $res = $this->getClient()->request('POST', $this->endpoint, [
                'form_params' => [
                    'secret' => $secretKey,
                    'response' => $this->{$attribute},
                    'remoteip' => request()->userIP
                ]
            ]);
            $body = Json::decode($res->getBody());
            $isValid = ArrayHelper::getValue($body, 'success', false);

            if (!$isValid) {
                $this->addError($attribute, 'Recaptcha failed server validation');
            }
        }
    }

    protected function getSecretKey() {
        return $this->secretKey ?: secret('google.recaptcha.secretKey', false);
    }

    /**
     * @return GuzzleHttp\Client
     */
    protected function getClient() {
        if ($this->_client === null) {
            $this->_client = new GuzzleHttp\Client();
        }
        return $this->_client;
    }

    /**
     * Sends an email to the specified email address using the information collected by this model.
     *
     * @param string $email the target email address
     * @return bool whether the email was sent
     */
    public function sendEmail($email) {
        return Yii::$app->mailer->compose()
            ->setTo($email)
            ->setFrom([$this->email => $this->name])
            ->setSubject($this->subject)
            ->setTextBody($this->body)
            ->send();
    }
}
