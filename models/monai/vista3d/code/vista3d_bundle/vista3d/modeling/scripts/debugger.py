import copy
from tkinter import Tk, filedialog, messagebox

import fire
import matplotlib.pyplot as plt
import nibabel as nib
import numpy as np
from matplotlib.widgets import Button, TextBox

from .infer import InferClass
from .utils.workflow_utils import get_point_label

inferer = InferClass(config_file=["./configs/infer.yaml"])


class samm_visualizer:
    def __init__(self):
        self.clicked_points = []
        self.data = None
        self.mask_plot = None
        self.mask = None
        self.data_path = None
        self.circle_artists = []
        self.class_label = None

    def select_data_file(self):
        root = Tk()
        root.withdraw()
        file_path = filedialog.askopenfilename(
            title="Select Data File", initialfile=self.data_path
        )
        if not file_path:
            print("No file selected.")
            exit()
        # Load data from NIfTI file
        try:
            nifti_img = nib.load(file_path)
            data = nifti_img.get_fdata()
            if len(data.shape) == 4:
                data = data[..., 0]  # Extract last element along the 4th dimension
        except FileNotFoundError:
            print("File not found.")
            exit()
        except nib.filebasedimages.ImageFileError:
            print("Invalid NIfTI file.")
            exit()
        self.data = data
        self.data_path = file_path

    def generate_mask(self):
        point = []
        point_label = []
        self.class_label = self.text_box.text
        if len(self.class_label) == 0:
            messagebox.showwarning(
                "Warning",
                "Label prompt is not specified. Assuming the point is for supported class. \
                                   For zero-shot, input random number > 132",
            )
            label_prompt = None
            prompt_class = None
            neg_id, pos_id = get_point_label(1)
        else:
            if self.class_label in [2, 20, 21]:
                messagebox.showwarning(
                    "Warning",
                    "Current debugger skip kidney (2), lung (20), and bone (21). Use their subclasses.",
                )
                return
            label_prompt = int(self.class_label)
            neg_id, pos_id = get_point_label(label_prompt)
            label_prompt = np.array([label_prompt])[np.newaxis, ...]
            prompt_class = copy.deepcopy(label_prompt)
        # if zero-shot
        if label_prompt is not None and label_prompt[0] > 132:
            label_prompt = None
        for p in self.clicked_points:
            point.append([p[1], p[0], p[2]])
            point_label.append(pos_id if p[3] == 1 else neg_id)
        if len(point) == 0:
            point = None
            point_label = None
        else:
            point = np.array(point)[np.newaxis, ...]
            point_label = np.array(point_label)[np.newaxis, ...]
        mask = inferer.infer(
            {"image": self.data_path},
            point,
            point_label,
            label_prompt,
            prompt_class,
            save_mask=True,
            point_start=self.point_start,
        )[0]
        nan_mask = np.isnan(mask)
        mask = mask.data.cpu().numpy() > 0.5
        mask = mask.astype(np.float32)
        mask[mask == 0] = np.nan
        if self.mask is None:
            self.mask = mask
        else:
            self.mask[~nan_mask] = mask[~nan_mask]

    def display_3d_slices(self):
        fig, ax = plt.subplots()
        assert self.data is not None, "Load data first."
        ax.volume = self.data
        ax.index = self.data.shape[2] // 2
        ax.imshow(self.data[:, :, ax.index], cmap="gray")
        ax.set_title(f"Slice {ax.index}")
        self.update_slice(ax)
        fig.canvas.mpl_connect("scroll_event", self.process_scroll)
        fig.canvas.mpl_connect("button_press_event", self.process_click)
        # Add numerical input box for slice index
        text_ax = plt.axes([0.45, 0.01, 0.2, 0.05])  # Position of the text box
        self.text_box = TextBox(text_ax, "Class prompt", initial=self.class_label)
        # Add a button
        button_ax = plt.axes([0.05, 0.01, 0.2, 0.05])  # Position of the button
        button = Button(button_ax, "Run")

        def on_button_click(event, ax=ax):
            # Define what happens when the button is clicked
            print("-- segmenting ---")
            self.generate_mask()
            print("-- done ---")
            print(
                "-- Note: Point only prompts will only do 128 cubic segmentation, a cropping artefact will be observed. ---"
            )
            print(
                "-- Note: Point without class will be treated as supported class, which has worse zero-shot ability. Try class > 132 to perform better zeroshot. ---"
            )
            print("-- Note: CTRL + Right Click will be adding negative points. ---")
            print(
                "-- Note: Click points on different foreground class will cause segmentation conflicts. Clear first. ---"
            )
            print(
                "-- Note: Click points not matching class prompts will also cause confusion. ---"
            )

            self.update_slice(ax)
            # self.point_start = len(self.clicked_points)

        button.on_clicked(on_button_click)

        button_ax_clear = plt.axes([0.75, 0.01, 0.2, 0.05])  # Position of the button
        button_clear = Button(button_ax_clear, "Clear")

        def on_button_click_clear(event, ax=ax):
            # Define what happens when the button is clicked
            inferer.clear_cache()
            # clear points
            self.clicked_points = []
            self.point_start = 0
            self.mask = None
            self.mask_plot.remove()
            self.mask_plot = None
            self.update_slice(ax)

        button_clear.on_clicked(on_button_click_clear)

        plt.show()

    def process_scroll(self, event):
        ax = event.inaxes
        try:
            if event.button == "up":
                self.previous_slice(ax)
            elif event.button == "down":
                self.next_slice(ax)
        except BaseException:
            pass

    def previous_slice(self, ax):
        if ax is None:
            return
        ax.index = (ax.index - 1) % ax.volume.shape[2]
        self.update_slice(ax)

    def next_slice(self, ax):
        if ax is None:
            return
        ax.index = (ax.index + 1) % ax.volume.shape[2]
        self.update_slice(ax)

    def update_slice(self, ax):
        # remove circles
        while len(self.circle_artists) > 0:
            ca = self.circle_artists.pop()
            ca.remove()
        # plot circles
        for x, y, z, label in self.clicked_points:
            if z == ax.index:
                color = "red" if (label == 1 or label == 3) else "blue"
                circle_artist = plt.Circle((x, y), 1, color=color, fill=False)
                self.circle_artists.append(circle_artist)
                ax.add_artist(circle_artist)
        ax.images[0].set_array(ax.volume[:, :, ax.index])
        if self.mask is not None and self.mask_plot is None:
            self.mask_plot = ax.imshow(
                np.zeros_like(self.mask[:, :, ax.index]) * np.nan,
                cmap="viridis",
                alpha=0.5,
            )
        if self.mask is not None and self.mask_plot is not None:
            self.mask_plot.set_data(self.mask[:, :, ax.index])
            self.mask_plot.set_visible(True)
        ax.set_title(f"Slice {ax.index}")
        ax.figure.canvas.draw()

    def process_click(self, event):
        try:
            ax = event.inaxes
            if ax is not None:
                x = int(event.xdata)
                y = int(event.ydata)
                z = ax.index
                print(f"Clicked coordinates: x={x}, y={y}, z={z}")
                if event.key == "control":
                    point_label = 0
                else:
                    point_label = 1
                self.clicked_points.append((x, y, z, point_label))
                self.update_slice(ax)
        except BaseException:
            pass

    def run(self):
        # File selection
        self.select_data_file()
        inferer.clear_cache()
        self.point_start = 0
        self.display_3d_slices()


if __name__ == "__main__":
    from monai.utils import optional_import

    fire, _ = optional_import("fire")
    # using python -m interactive run
    fire.Fire(samm_visualizer)
