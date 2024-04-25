import { Checkbox, Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react'
import { IAvatarModalProps } from '@portal/shared/utils/types'
import { CHANGE_AVATAR } from '@src/constants/content'
import { Button, CustomTypography, Input } from 'components'
import { ChangeEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import NoTokenfound from '../../../assets/images/no-activity.png'
import { CheckRoundedPrimaryIcon, CloseRoundedIcon, SearchIcon } from '../Icons'

const ChangeProfileAvatar = ({
  openModal,
  closeModal,
  selectedAvatar,
  setSelectedAvatar,
  handleAvatarChange,
}: IAvatarModalProps) => {
  const { t } = useTranslation()
  const [isSearchAvatar, setSearchAvatar] = useState<string>('')
  const [filteredAvatars, setFilteredAvatars] = useState(CHANGE_AVATAR)
  const [avatar, setAvatar] = useState<string>(selectedAvatar as string)

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchAvatar(event.target.value)

    const filtered = CHANGE_AVATAR.filter((avatar) =>
      avatar.alt.toLowerCase().includes(event.target.value.toLowerCase())
    )
    setFilteredAvatars(filtered)
  }

  return (
    <Modal
      backdrop="opaque"
      isOpen={openModal}
      onClose={() => {
        closeModal()
        setSearchAvatar('')
        setFilteredAvatars(CHANGE_AVATAR)
      }}
      hideCloseButton={true}
      placement="center"
      className="max-w-[22rem]"
      classNames={{
        header: 'border-b-1 border-custom-white10',
      }}
    >
      <ModalContent className="py-3 rounded-[1.75rem] dark:bg-surface-dark bg-custom-white">
        <ModalHeader className="flex flex-col gap-1 text-center pb-4 pt-2">{t('Account.changeAvatar')}</ModalHeader>
        <ModalBody className="pt-4 px-4">
          <div className="flex flex-col h-full justify-between">
            <div className="space-y-2">
              <Input
                fullWidth
                dataAid="searchBar"
                placeholder={t('Actions.search') as string}
                className="search-input font-bold"
                icon={
                  filteredAvatars.length === 0 ? (
                    <Button
                      variant="light"
                      size="sm"
                      isIconOnly
                      onClick={() => {
                        setSearchAvatar('')
                        setFilteredAvatars(CHANGE_AVATAR)
                      }}
                    >
                      <CloseRoundedIcon />
                    </Button>
                  ) : (
                    <SearchIcon className="pr-1" />
                  )
                }
                mainColor
                onChange={handleSearchChange}
                value={isSearchAvatar}
              />

              {filteredAvatars.length === 0 ? (
                <div className="space-y-4 py-8">
                  <img src={NoTokenfound} alt="No Avatar found" className="mx-auto" />
                  <CustomTypography variant="subtitle" type="secondary" className="text-center">
                    {t('Account.noImagefound')}
                  </CustomTypography>
                </div>
              ) : (
                <div className="py-4 mx-auto w-fit flex flex-wrap gap-3 min-h-[9rem]">
                  {filteredAvatars.map((avatarItems) => (
                    <button
                      type="button"
                      key={avatarItems.image}
                      className="h-[4.375rem] w-[4.375rem] rounded-md relative"
                      onClick={() => setAvatar(avatarItems?.image)}
                    >
                      {avatar === avatarItems.image && (
                        <div
                          className={`z-10 relative flex bg-surface-dark/50 h-full justify-center pl-4 ${
                            avatar === avatarItems.image ? 'border-2 border-primary rounded-md shadow-lg' : ''
                          }`}
                        >
                          <Checkbox
                            size="lg"
                            radius="sm"
                            isSelected={avatar}
                            onValueChange={setAvatar}
                            icon={<CheckRoundedPrimaryIcon className="w-6 h-6 after:bg-transparent" />}
                            className="rounded-full mr-0 items-center"
                          />
                        </div>
                      )}
                      <img src={avatarItems.image} alt="avatar" className="rounded-md absolute top-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-between items-center gap-2">
              <Button
                variant="bordered"
                color="outlined"
                onClick={() => {
                  closeModal()
                  setSearchAvatar('')
                  setFilteredAvatars(CHANGE_AVATAR)
                }}
              >
                {t('Onboarding.close')}
              </Button>
              <Button
                fullWidth
                type="submit"
                isDisabled={!avatar}
                onClick={() => {
                  setSelectedAvatar(avatar)
                  handleAvatarChange()
                }}
                data-test-id="create-subaccount-btn"
                color={`${!avatar ? 'disabled' : 'primary'}`}
              >
                {t('Actions.change')}
              </Button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ChangeProfileAvatar
